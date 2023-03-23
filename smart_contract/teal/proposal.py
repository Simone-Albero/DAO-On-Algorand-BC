from pyteal import *
from pyteal_helpers import program

def approval():
    ## global Var
    global_creator = Bytes("creator") # byteslice
    global_daoAppId = Bytes("daoAppId") # uint64
    global_description = Bytes("description") # byteslice
    global_url = Bytes("url") # byteslice 
    global_urlHash = Bytes("urlHash") # byteslice
    global_startDate = Bytes("startDate") # uint64 
    global_endDate = Bytes("endDate") # uint64
    global_prevProposal = Bytes("pervProposal") # uint64 (set)
    global_yesVotes = Bytes("yesVotes") # uint64 
    global_noVotes = Bytes("noVotes") # uint64 
    global_optouts = Bytes("optouts") # uint64

    ## local Var
    local_hasVoted = Bytes("hasVoted") # uint64
    local_choice = Bytes("choice") # byteslice

    ## operation
    op_setVote = Bytes("setVote")

    @Subroutine(TealType.bytes)
    def getExternalBytes(appId: Expr ,value: Expr):
        myStatus = App.globalGetEx(appId, value)
        program = Seq([
            myStatus,
            If(myStatus.hasValue(), myStatus.value(), Bytes("none"))
        ])
        return program

    @Subroutine(TealType.uint64)
    def getExternalInt(appId: Expr ,value: Expr):
        myStatus = App.globalGetEx(appId, value)
        program = Seq([
            myStatus,
            If(myStatus.hasValue(), myStatus.value(), Int(0))
        ])
        return program

    @Subroutine(TealType.uint64)
    def getSenderAsset():
        senderAssetBalance = AssetHolding.balance(Txn.sender(), Txn.assets[0])
        program = Seq([
            senderAssetBalance,
            Assert(senderAssetBalance.hasValue()),
            senderAssetBalance.value()
        ])
        return program


  
    @Subroutine(TealType.none)
    def proposalInit():
        return Seq(
            program.check_self(
                # checking group transaction
                group_size=Int(2),
                group_index=Int(0),
            ),
            program.check_rekey_zero(2),
            Assert(
                And(
                    # checking app args
                    Txn.application_args.length() == Int(5),

                    # checking date
                    Int(0) < Btoi(Txn.application_args[3]),
                    Int(0) < Btoi(Txn.application_args[4]),
                    
                    # da valutare
                    #Global.latest_timestamp() < Btoi(Txn.application_args[3]),
                    Global.latest_timestamp() < Btoi(Txn.application_args[4]),

                    # second transaction is last proposal setter
                    Gtxn[1].type_enum() == TxnType.ApplicationCall,
                    Gtxn[1].application_args[0] == Bytes("setLstProposalAddr"),

                ),
            ),

            App.globalPut(global_creator, Txn.sender()),
            App.globalPut(global_daoAppId, Txn.applications[1]),
            App.globalPut(global_description, Txn.application_args[0]),
            App.globalPut(global_url, Txn.application_args[1]),
            App.globalPut(global_urlHash, Txn.application_args[2]),
            App.globalPut(global_startDate, Btoi(Txn.application_args[3])),
            App.globalPut(global_endDate, Btoi(Txn.application_args[4])),
            App.globalPut(global_prevProposal, getExternalInt(Txn.applications[1], Bytes("lstProposalAddr"))),
            App.globalPut(global_yesVotes, Int(0)),
            App.globalPut(global_noVotes, Int(0)),
            App.globalPut(global_optouts, Int(0)),

            Approve()
        )

    @Subroutine(TealType.none)
    def optIn():
        return Seq(
            program.check_self(
                # checking group transaction
                group_size=Int(1),
                group_index=Int(0),
            ),
            program.check_rekey_zero(1),
            Assert(
                And(
                    # checking app args
                    Txn.application_args.length() == Int(0),

                    # checking if sender as the specified asset
                    getSenderAsset() != Int(0),

                    # checking date
                    Global.latest_timestamp() > App.globalGet(global_startDate),
                    Global.latest_timestamp() < App.globalGet(global_endDate),
                ),
            ),

            App.localPut(Txn.sender(), local_hasVoted, Int(0)),
            App.localPut(Txn.sender(), local_choice, Bytes("")),
        )

    @Subroutine(TealType.none)
    def setVote():
        # basic sanity checks
        program.check_self(
            group_size=Int(1),
            group_index=Int(0),
        ),
        program.check_rekey_zero(1),
        
        return Seq(
            Assert(
                And(
                    # checking if sender has opted-in
                    App.optedIn(Txn.sender(), Txn.application_id()),

                    # checking if sender has not voted yet
                    App.localGet(Txn.sender(), local_hasVoted) == Int(0),

                    # checking txn args
                    Txn.application_args.length() == Int(2),

                    # checking sender choice
                    Or(
                        Txn.application_args[1] == Bytes("yes"),
                        Txn.application_args[1] == Bytes("no"),
                    ),
                ),
            ),

            App.localPut(Txn.sender(), local_hasVoted, Int(1)),
            App.localPut(Txn.sender(), local_choice, Txn.application_args[1]),
                
            If(Txn.application_args[1] == Bytes("yes"))
            .Then(App.globalPut(global_yesVotes, App.globalGet(global_yesVotes) + Int(1)))
            .Else(App.globalPut(global_noVotes, App.globalGet(global_noVotes) + Int(1))),
            Approve()
        )

    return program.event(
        init=Seq(
            proposalInit(),
            Approve()
        ),
        opt_in=Seq(
            optIn(),
            Approve()
        ),
        no_op=Seq(
            Cond(
                [
                    Txn.application_args[0] == op_setVote,
                    setVote(),
                ],
            ),
            Reject(),
        ),
    )


def clear():
    return Approve()
from pyteal import *
from pyteal_helpers import program


def approval():
    ## global Var
    global_owner = Bytes("owner") # byteslice (set)
    global_name = Bytes("name") # byteslice (set)
    global_url = Bytes("url") # byteslice 
    global_urlHash = Bytes("urlHash") # byteslice
    global_isProposalPublic = Bytes("isProposalPublic") # uint64 (set)
    global_lstProposalAddr = Bytes("lstProposalAddr") # uint64 (set)
    global_tokenAdd = Bytes("tokenAdd") # uint64
    global_isAssociation = Bytes("isAssociation") # uint64 

    ## operation
    op_setOwner = Bytes("setOwner")
    op_setName = Bytes("setName")
    op_setIsProposalPublic = Bytes("setIsProposalPublic")
    op_setLstProposalAddr = Bytes("setLstProposalAddr")

    @Subroutine(TealType.none)
    def basicTxnCheck(nArgs: Expr):
        return Seq(
            # basic sanity checks
            program.check_self(
                group_size=Int(1),
                group_index=Int(0),
            ),
            program.check_rekey_zero(1),

            # checking required arguments
            Assert(Txn.application_args.length() == nArgs),
        )
    
    @Subroutine(TealType.none)
    def setterOpCheck():
        return Seq(
            basicTxnCheck(Int(2)),
            
            Assert(
                # checking txn sender (must be the owner) 
                Txn.sender() == App.globalGet(global_owner),
            )
        )

    @Subroutine(TealType.none)
    def daoInit():
        return Seq(
            # basic sanity checks
           basicTxnCheck(Int(6)),
            Assert(
                Or(
                    # checking that 3th arg is bool
                    Btoi(Txn.application_args[3]) == Int(0),
                    Btoi(Txn.application_args[3]) == Int(1),
                        
                    # checking that 5th arg is bool
                    Btoi(Txn.application_args[5]) == Int(0),
                    Btoi(Txn.application_args[5]) == Int(1),

                    # checking that 4th arg is integer
                    Int(0) < Btoi(Txn.application_args[4]),

                ),
            ),

            App.globalPut(global_owner, Txn.sender()),
            App.globalPut(global_name, Txn.application_args[0]),
            App.globalPut(global_url, Txn.application_args[1]),
            App.globalPut(global_urlHash, Txn.application_args[2]),
            App.globalPut(global_isProposalPublic, Btoi(Txn.application_args[3])),
            App.globalPut(global_lstProposalAddr, Int(0)),
            App.globalPut(global_tokenAdd, Btoi(Txn.application_args[4])),
            App.globalPut(global_isAssociation, Btoi(Txn.application_args[5])),
            
            Approve(),
        )  

    @Subroutine(TealType.none)
    def setOwner():
        return Seq(
            # owner and txn check 
            setterOpCheck(),

            App.globalPut(global_owner, Txn.application_args[1]),
            Approve(),
        )

    @Subroutine(TealType.none)
    def setName():
        return Seq(
            # owner and txn check
            setterOpCheck(),

            App.globalPut(global_name, Txn.application_args[1]),
            Approve(),
        )
    
    @Subroutine(TealType.none)
    def setIsProposalPublic():
        return Seq(
            # owner and txn check 
            setterOpCheck(),

            # checking that args[1] is boolean 
            Assert(
                Or(
                    Btoi(Txn.application_args[1]) == Int(0),
                    Btoi(Txn.application_args[1]) == Int(1),
                )
            ),

            App.globalPut(global_isProposalPublic, Btoi(Txn.application_args[1])),
            Approve(),
        )

    @Subroutine(TealType.none)
    def setLstProposalAddr():
        return Seq(
            # basic sanity checks
            program.check_self(
                group_size=Int(2),
                group_index=Int(1),
            ),
            program.check_rekey_zero(2),

            Assert(
                And(
                    # checking required arguments
                    Txn.application_args.length() == Int(1),

                    # first transaction is app creation
                    Gtxn[0].type_enum() == TxnType.ApplicationCall,
                    Gtxn[0].applications[1] == Txn.applications[0],
                )
            ),
            
            # checking sender if proposal is not public 
            If(App.globalGet(global_isProposalPublic) == Int(0))
            .Then(Assert(Txn.sender() == App.globalGet(global_owner))),

            App.globalPut(global_lstProposalAddr, Gtxn[0].created_application_id()),
            Approve(),
        )

    return program.event(
        init=Seq(
            daoInit(),
            Approve()
        ),
        opt_in=Approve(),
        no_op=Seq(
            Cond(
                [
                    Txn.application_args[0] == op_setOwner,
                    setOwner(),
                ],
                [
                    Txn.application_args[0] == op_setName,
                    setName(),
                ],
                [
                    Txn.application_args[0] == op_setIsProposalPublic,
                    setIsProposalPublic(),
                ],
                [
                    Txn.application_args[0] == op_setLstProposalAddr,
                    setLstProposalAddr(),
                ],
            ),
            Reject(),
        ),
    )


def clear():
    return Approve()

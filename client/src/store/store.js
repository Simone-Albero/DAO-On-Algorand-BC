import { createStore } from 'vuex'

export default createStore({
    state: {
        //shared data here
        walletAddr: '',
        isPeraConnected: false,
        isMyAlgoConnected: false,
        isAlgoSignerConnected: false
    },
    mutations: {
        setWalletAddr(state, addr) {
            localStorage.setItem('walletAddr', addr); 
            state.walletAddr = addr;
        },

        logout(state) {
            localStorage.setItem('walletAddr', '');
            state.walletAddr = '';
            state.isMyAlgoConnected = false;
            state.isPeraConnected = false;
            state.isAlgoSignerConnected = false;
        },

        toggleMyAlgoStatus(state) {
            localStorage.setItem('isMyAlgoConnected', !state.isMyAlgoConnected);
            state.isAlgoSigner = !state.isMyAlgoConnected;
        },

        togglePeraStatus(state) {
            localStorage.setItem('isPeraConnected', !state.isPeraConnected);
            state.isAlgoSigner = !state.isPeraConnected;
        },

        toggleAlgoSignerStatus(state) {
            localStorage.setItem('isAlgoSignerConnected', !state.isAlgoSignerConnected);
            state.isAlgoSigner = !state.isAlgoSignerConnected;
        },

        storeInit(state) {
            if(localStorage.getItem('walletAddr')) state.walletAddr = localStorage.getItem('walletAddr');
            if(localStorage.getItem('isMyAlgoConnected')) state.isMyAlgoConnected = localStorage.getItem('isMyAlgoConnected');
            if(localStorage.getItem('isPeraConnected')) state.isPeraConnected = localStorage.getItem('isPeraConnected');
            if(localStorage.getItem('isAlgoSignerConnected')) state.isAlgoSignerConnected = localStorage.getItem('isAlgoSignerConnected');
        }
    }
})
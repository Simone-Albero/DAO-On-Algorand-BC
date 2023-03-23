<template>
    <nav class="navbar shadow-sm navbar-light bg-light p-0">
        <ul class="navbar-nav d-flex flex-column align-self-start p-3">

            <li class="nav-item text-muted mt-4 mb-3">Core</li>

            <li id="about" class="nav-item ml-1">
                <router-link class="nav-link" to="/about">
                    <i class="bi bi-chat-right-quote mr-2"></i>
                    About
                    <i class="bi bi-caret-right float-right"></i>
                </router-link>
            </li>
            <li id="home" class="nav-item ml-1">
                <router-link class="nav-link" to="/">
                    <i class="bi bi-speedometer2 mr-2"></i>
                    Dashboard
                    <i class="bi bi-caret-right float-right"></i>
                </router-link>
            </li>

            <li class="nav-item text-muted mt-4 mb-2">Interfaces</li>

            <li class="nav-item dropdown">
                <a @click="toggleMenu(0, 1)" class="nav-link" href="#" role="button" data-toggle="dropdown"
                    aria-expanded="false">
                    <i class="bi bi-activity mr-2"></i>
                    Daos
                    <i class="bi bi-caret-right float-right"></i>
                    <i class="bi bi-caret-down float-right"></i>
                </a>
                <div class="dropdown-menu bg-light">
                    <router-link class="dropdown-item" to="/dao/all">
                        <i class="bi bi-globe mr-2"></i>
                        All Daos
                        <i class="bi bi-caret-right float-right"></i>
                    </router-link>
                    <router-link class="dropdown-item" to="/dao">
                        <i class="bi bi-inbox mr-2"></i>
                        Your Daos
                        <i class="bi bi-caret-right float-right"></i>
                    </router-link>
                    <router-link class="dropdown-item" to="/dao/create">
                        <i class="bi bi-briefcase mr-2"></i>
                        Create Dao
                        <i class="bi bi-caret-right float-right"></i>
                    </router-link>
                </div>
            </li>

            <li class="nav-item dropdown" id="drop1">
                <a @click="toggleMenu(1, 0)" class="nav-link" href="#" role="button" data-toggle="dropdown"
                    aria-expanded="false">
                    <i class="bi bi-receipt mr-2"></i>
                    Proposals
                    <i class="bi bi-caret-right float-right"></i>
                    <i class="bi bi-caret-down float-right"></i>
                </a>

                <div class="dropdown-menu bg-light">
                    <router-link class="dropdown-item" to="/proposal">
                        <i class="bi bi-inbox mr-1"></i>
                        Your Proposals
                        <i class="bi bi-caret-right float-right"></i>
                    </router-link>
                </div>
            </li>

        </ul>

        <div class="card-footer text-muted align-self-end">Copyright &copy; Tesi Simone Albero 2022</div>

    </nav>
</template>

<script>

export default {

    data() {
        return {
            isOpen: [false, false],
            drop1: {}
        }
    },


}

$('drop1').on('shown.bs.dropdown', function () {
    console.log("aperto")
})
</script>

<style scoped>
.navbar-nav {
    width: 100%;
}

.nav-link:hover {
    color: #007bff !important;
}

.nav-link:focus {
    color: #007bff !important;
}

.dropdown-menu {
    background-color: transparent !important;
    border-left: 1px solid darkgray;
    border-right: 0px;
    border-top: 0px;
    border-bottom: 0px;
    margin-left: 0.5vw;
    border-radius: 0;
}

.dropdown-item {
    padding-left: 8px !important;
    padding-right: 0px !important;
}

.dropdown-item:hover {
    color: #007bff !important;
    background-color: transparent !important;
    ;
}

a[aria-expanded=true] .bi-caret-right {
    display: none;
}

a[aria-expanded=false] .bi-caret-down {
    display: none;
}
</style>
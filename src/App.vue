<template>
    <el-container id="app">
        <el-header>
            <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1" class="app-menu">EOS钱包</el-menu-item>
                <el-menu-item index="2" class="app-menu">其他工具</el-menu-item>
            </el-menu>
        </el-header>
        <el-main>
            <router-view/>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                activeIndex: '1'
            }
        },
        created: function () {
        },
        methods: {
// eslint-disable-next-line no-unused-vars
            handleSelect(key, keyPath) {
                // console.log(key, keyPath)
                if (key === '1') {
                    this.$router.push('/Wallet')
                }
                if (key === '2') {
                    this.$router.push('/Other')
                }
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 0px;
    }

    .app-menu {
        width: 120px;
    }
</style>

<template>
    <div id="app">
        <mu-appbar style="width: 100%; height: 56px; position: fixed; top: 0;" color="primary">
            <mu-button icon slot="left" v-show="back" @click="goBack">
                <mu-icon value="chevron_left"></mu-icon>
            </mu-button>
            <mu-button icon slot="left" v-show="!back">
                <mu-icon value=""></mu-icon>
            </mu-button>
            {{ title }}
            <mu-button icon slot="right" v-show="add" @click="goAdd">
                <mu-icon value="add"></mu-icon>
            </mu-button>
            <mu-button icon slot="right" v-show="qr" @click="goQr">
                <i class="fa fa-qrcode"></i>
            </mu-button>
            <mu-button icon slot="right" v-show="!add && !qr">
                <mu-icon value=""></mu-icon>
            </mu-button>
        </mu-appbar>
        <div style="width: 100%; position: fixed; top: 56px; bottom: 56px; overflow: scroll;">
            <router-view v-on:setTop="setTopFromChild" ref="child"/>
        </div>
        <mu-bottom-nav style="width: 100%; position: fixed; bottom: 0; border-top: 1px solid #e0e0e0;" @change="handleSelect" :value="path">
            <mu-bottom-nav-item title="钱包" value="1" icon="credit_card"></mu-bottom-nav-item>
            <!--<mu-bottom-nav-item title="浏览器" value="2" icon="explore"></mu-bottom-nav-item>-->
            <mu-bottom-nav-item title="创建" value="2" icon="person_add"></mu-bottom-nav-item>
        </mu-bottom-nav>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                path: '1',
                title: 'DisToken',
                back: false,
                add: false,
                qr: false
            }
        },
        created: function () {
            this.$router.replace('/AccountList')
        },
        methods: {
            handleSelect(value) {
                this.path = value
                // console.log(value)
                if (value == '1') {
                    this.$router.replace('/AccountList')
                }
                if (value == '2') {
                    // this.$router.replace('/Web')
                    // this.$router.replace('/QrCode')
                    this.$router.replace('/Other')
                }
            },
            setTopFromChild(data) {
                this.title = data.title
                this.back = data.back
                this.add = data.add
                this.qr = data.qr
                this.path = data.path
            },
            goBack() {
                this.$router.go(-1);
            },
            goAdd() {
                let self = this
                if (typeof self.$refs.child.addClick == 'function') {
                    self.$refs.child.addClick();
                }
            },
            goQr() {
                let self = this
                if (typeof self.$refs.child.qrClick == 'function') {
                    self.$refs.child.qrClick();
                }
            }
        }
    }
</script>

<style>
    #app {
        text-align: center;
    }
</style>

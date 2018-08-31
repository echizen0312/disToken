<template>
    <div style="width: 100%; padding: 10px; max-width: 450px; margin: 0 auto;">
        <mu-card
                v-for="(account, index) in accounts"
                v-if="account.name != 'a'"
                :key="account.name + index"
                style="width: 100%; margin-bottom: 10px; text-align: left; position: relative; background-color: #e3f2fd;"
                @click="accountClick(account)">
            <mu-card-title :title="account.name" sub-title="TOK账户"></mu-card-title>
            <mu-button icon color="red400" style="position: absolute; top: 20px; right: 5px;"
                       @click.stop="removeAccount(account)">
                <mu-icon value="close"></mu-icon>
            </mu-button>
        </mu-card>
        <div v-for="(account, index) in accounts" :key="account.key + index" style=" display: none;"/>
        <mu-dialog title="导入明文私钥" width="600" max-width="80%" :esc-press-close="false"
                   :overlay-close="false" :open.sync="openAlert">
            <mu-form :model="form" label-width="80">
                <mu-form-item prop="input" label="明文私钥">
                    <mu-text-field v-model="form.privateKey"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="input" label="交易密码">
                    <mu-text-field v-model="form.aesKey" type="password"></mu-text-field>
                </mu-form-item>
            </mu-form>
            <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">关闭</mu-button>
            <mu-button slot="actions" color="primary" @click="submitAlertDialog">确定</mu-button>
        </mu-dialog>
    </div>
</template>

<script>
    /* eslint-disable no-undef */

    let Eos = require('eosjs')
    let ecc = require('eosjs-ecc')
    let CryptoJS = require("crypto-js")
    export default {
        name: 'AccountList',
        data() {
            return {
                config: config,
                accounts: [{
                    name: 'a',
                    key: 'b'
                }],
                accountsC: [],
                openAlert: false,
                form: {
                    privateKey: '',
                    aesKey: ''
                }
            }
        },
        created: function () {
            let self = this
            self.$emit('setTop', {title: 'DisToken', back: false, add: true});
            let hasAccs = self.$cookies.isKey('disTokenAccounts')
            if (hasAccs) {
                let tmp = JSON.parse(self.$cookies.get('disTokenAccounts'))
                for (let i in tmp) {
                    self.accounts.push(tmp[i])
                    self.accountsC.push(tmp[i])
                }
            }
            if (self.accountsC.length == 0) {
                self.openAlert = true
            }
        },
        methods: {
            addClick: function () {
                this.openAlert = true
                this.form.privateKey = ''
                this.form.aesKey = ''
            },
            closeAlertDialog: function () {
                this.openAlert = false
            },
            submitAlertDialog: function () {
                this.getAccountNameFromKey()
            },
            accountClick: function (acc) {
                let self = this
                self.nowAccount = acc
                if (self.nowAccount != null) {
                    // console.log(acc)
                    this.$router.push('/Account/' + acc.name)
                }
            },
            getAccountNameFromKey: function () {
                let self = this
                if (self.form.privateKey != '' && self.form.aesKey != '') {
                    let config = self.config
                    let eos = Eos(config)
                    let key = self.form.privateKey
                    let pub = ecc.privateToPublic(key)
                    let ciphertext = CryptoJS.AES.encrypt(key, self.form.aesKey);
                    let aesR = ciphertext.toString()
                    let acc = {
                        name: '',
                        key: aesR,
                        ram: {
                            ram_quota: '0',
                            ram_usage: '0'
                        },
                        cpu: {
                            max: '0',
                            available: '0',
                            used: '0'
                        },
                        net: {
                            max: '0',
                            available: '0',
                            used: '0'
                        }
                    }
                    eos.getKeyAccounts({
                        public_key: pub
                    }).then(result => {
                        let ss = result.account_names
                        if (ss !== undefined && ss.length === 1) {
                            acc.name = ss[0]
                            self.accounts.push(acc)
                            self.accountsC.push(acc)
                            self.$cookies.set('disTokenAccounts', JSON.stringify(self.accountsC))

                        } else {
                            alert('你牛逼')
                        }
                        self.openAlert = false
                    }).catch(error => {
                        console.log(error)
                    })
                }
            },
            removeAccount: function (acc) {
                let self = this
                for (let i in self.accounts) {
                    let obj = self.accounts[i]
                    if (obj.name === acc.name) {
                        self.accounts.splice(i, 1)
                    }
                }
                for (let i in self.accountsC) {
                    let obj = self.accountsC[i]
                    if (obj.name === acc.name) {
                        self.accountsC.splice(i, 1)
                    }
                }
                self.nowAccount = null
                self.$cookies.set('disTokenAccounts', JSON.stringify(self.accountsC))
            }
        }
    }
</script>

<style scoped>

</style>

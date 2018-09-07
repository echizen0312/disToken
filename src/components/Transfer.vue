<template>
    <div style="width: 100%; padding: 10px; max-width: 600px; margin: 0 auto;">
        <mu-card
                v-if="!isOver"
                style="width: 100%; margin-bottom: 10px; text-align: left; position: relative;">
            <mu-card-title title="代币转账"></mu-card-title>
            <mu-divider></mu-divider>
            <div style="padding: 10px 15px 5px 15px; ">
                <mu-form :model="form" label-position="top" style="">
                    <mu-form-item label="代币">
                        <mu-text-field :value="token_name" readonly></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="发送者">
                        <mu-text-field :value="account_name" readonly></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="接收者">
                        <mu-text-field v-model="form.to"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="数量（必须为四位小数数字）">
                        <mu-text-field v-model="form.number" type="number"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="备注（可选）">
                        <mu-text-field v-model="form.memo"></mu-text-field>
                    </mu-form-item>
                    <div style="margin-bottom: 20px; display: flex; justify-content: flex-end;">
                        <mu-button color="error" @click="transferBalance">提交</mu-button>
                    </div>
                </mu-form>
            </div>
        </mu-card>
        <mu-card
                v-else
                style="width: 100%; margin-bottom: 10px; text-align: left; position: relative;">
            <mu-card-title title="转账成功"></mu-card-title>
            <mu-divider></mu-divider>
            <div style="padding: 10px 15px 5px 15px; ">
                <mu-form :model="form" label-position="top" style="">
                    <mu-form-item label="代币">
                        <mu-text-field :value="token_name" readonly></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="发送者">
                        <mu-text-field :value="account_name" readonly></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="接收者">
                        <mu-text-field v-model="form.to" readonly></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="数量（必须为四位小数数字）">
                        <mu-text-field v-model="form.number" type="number" readonly></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="备注（可选）">
                        <mu-text-field v-model="form.memo" readonly></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="交易ID">
                        <mu-text-field v-model="trx_id" readonly></mu-text-field>
                    </mu-form-item>
                    <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
                        <mu-button color="success" @click="goBack">返回</mu-button>
                        <mu-button color="primary" @click="goTracker">查看</mu-button>
                    </div>
                </mu-form>
            </div>
        </mu-card>
    </div>
</template>

<script>
    /* eslint-disable no-undef */

    let Eos = require('eosjs')
    // let ecc = require('eosjs-ecc')
    let CryptoJS = require("crypto-js")
    export default {
        name: 'Transfer',
        data() {
            return {
                config: config,
                trackerAddress: trackerAddress,
                account_name: null,
                token_name: null,
                account: {
                    name: '',
                    key: '',
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
                },
                sysToken: sysToken,
                userToken: userToken,
                nowToken: {
                    account: 'eosio.token',
                    name: 'TOK',
                    balance: 0,
                    isSys: true
                },
                form: {
                    to: '',
                    number: '',
                    memo: ''
                },
                isOver: false,
                isTring: false,
                trx_id: ''
            }
        },
        created: function () {
            let self = this
            self.$emit('setTop', {title: 'DisToken', back: true, add: false, path: '1'})
            self.account_name = self.$route.params.name
            self.account = null
            let hasAccs = self.$cookies.isKey('disTokenAccounts')
            if (hasAccs) {
                let tmp = JSON.parse(self.$cookies.get('disTokenAccounts'))
                for (let i in tmp) {
                    if (tmp[i].name == self.account_name) {
                        self.account = tmp[i]
                    }
                }
            }
            self.token_name = self.$route.params.token
            if (self.token_name == self.sysToken.name) {
                self.nowToken = self.sysToken
            }
            for (let i in userToken) {
                if (userToken[i].name == self.token_name) {
                    self.nowToken = userToken[i]
                }
            }
        },
        methods: {
            transferBalance: function () {
                let self = this
                if (self.account.name != '' && self.form.to !== '' && Number.parseFloat(self.form.number) > 0 && !self.isTring) {
                    self.$prompt('请输入交易密码', '提示', {inputType: 'password'}).then(data => {
                        const loading = self.$loading()
                        setTimeout(function () {
                            if (data.result && data.value != undefined && data.value != '') {
                                let bytes = CryptoJS.AES.decrypt(self.account.key, data.value)
                                let plaintext = bytes.toString(CryptoJS.enc.Utf8)
                                self.isTring = true
                                let config = self.config
                                config.keyProvider = plaintext
                                let eos = Eos(config)
                                let quantity = self.form.number.toString() + ' ' + self.nowToken.name
                                if (self.nowToken.isSys) {
                                    eos.transfer(self.account.name, self.form.to, quantity, self.form.memo).then(result => {
                                        let trx_id = result.transaction_id
                                        self.trx_id = trx_id
                                        loading.close()
                                        self.isTring = false
                                        self.isOver = true
                                        self.$alert('转账成功', '提示', {type: 'success'})
                                    }).catch(error => {
                                        loading.close()
                                        console.log(error)
                                        self.isTring = false
                                        self.$alert('转账失败', '提示', {type: 'error'})
                                    })
                                } else {
                                    eos.contract(self.nowToken.account).then(con => {
                                        con.transfer(self.account.name, self.form.to, quantity, self.form.memo).then(result => {
                                            let trx_id = result.transaction_id
                                            self.trx_id = trx_id
                                            loading.close()
                                            self.isTring = false
                                            self.isOver = true
                                            self.$alert('转账成功', '提示', {type: 'success'})
                                        }).catch(error => {
                                            loading.close()
                                            console.log(error)
                                            self.isTring = false
                                            self.$alert('转账失败', '提示', {type: 'error'})
                                        })
                                    }).catch(error => {
                                        loading.close()
                                        console.log(error)
                                        self.isTring = false
                                        self.$alert('转账失败', '提示', {type: 'error'})
                                    })
                                }
                            } else {
                                loading.close()
                            }
                        }, 500)
                    }).catch(e => {
                        console.log(e)
                    })

                }
            },
            goBack() {
                this.$router.go(-1);
            },
            goTracker: function () {
                window.open(trackerAddress + 'Transaction/' + this.trx_id)
                // this.$router.push('/Tracker/' + this.trx_id)
            }
        }
    }
</script>

<style scoped>

</style>

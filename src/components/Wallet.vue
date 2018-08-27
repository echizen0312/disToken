<template>
    <div>
        <div class="index-box">
            <el-button class="index-account-button" v-for="account in accounts" :key="account.name"
                       @click.native="accountClick(account)">
                <div>
                    {{account.name}}
                </div>
            </el-button>
            <el-button class="index-account-button" icon="el-icon-plus" @click.native="openForm2"/>
        </div>
        <div class="index-main" v-if="nowAccount != null">
            <el-container>
                <el-aside class="index-main-left">
                    <el-card>
                        <div class="index-main-left-split">当前账户</div>
                        <div class="index-main-left-token" style="position: relative;">
                            <div style="color: #08192D;">{{nowAccount === null ? '' : nowAccount.name}}</div>
                            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                                       style="position: absolute; right: 0px; cursor: pointer;"
                                       @click.native="removeAccount"></el-button>
                        </div>
                        <div class="index-main-left-token" style="font-size: 15px;" @click="ramClick">
                            <div>RAM</div>
                            <div style="flex: 1; text-align: right;">{{nowAccount.ram.ram_usage}} /
                                {{nowAccount.ram.ram_quota}}
                            </div>
                        </div>
                        <div class="index-main-left-token" style="font-size: 15px;" @click="BWClick">
                            <div>NET</div>
                            <div style="flex: 1; text-align: right;">{{nowAccount.net.used}} / {{nowAccount.net.max}}
                            </div>
                        </div>
                        <div class="index-main-left-token" style="font-size: 15px;" @click="BWClick">
                            <div>CPU</div>
                            <div style="flex: 1; text-align: right;">{{nowAccount.cpu.used}} / {{nowAccount.cpu.max}}
                            </div>
                        </div>
                        <div class="index-main-left-split" style="margin-top: 30px;">系统代币</div>
                        <div class="index-main-left-token" @click="tokenClick(sysToken)">
                            <div>{{sysToken.name}}</div>
                            <div style="flex: 1; text-align: right;">{{sysToken.balance.toFixed(4)}}</div>
                        </div>
                        <div class="index-main-left-split" style="margin-top: 30px;">用户代币</div>
                        <div class="index-main-left-token" v-for="token in userToken" :key="token.account + token.name"
                             @click="tokenClick(token)">
                            <div>{{token.name}}</div>
                            <div style="flex: 1; text-align: right;">{{token.balance.toFixed(4)}}</div>
                        </div>
                    </el-card>
                </el-aside>
                <el-main class="index-main-center" v-loading="loading">
                    <el-card v-if="nowToken != null">
                        <div slot="header" class="clearfix">
                            <span>{{nowToken.name}}转账</span>
                        </div>
                        <el-form ref="form1" :model="form1" label-width="100px">
                            <el-form-item label="目标账户">
                                <el-input v-model="form1.to" placeholder="务必填写正确的对方账户"></el-input>
                            </el-form-item>
                            <el-form-item label="转账数量">
                                <el-input v-model="form1.number" placeholder="必须是四位小数的数字"></el-input>
                            </el-form-item>
                            <el-form-item label="备注（选填）">
                                <el-input v-model="form1.memo" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click.native="transferBalance">转账</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                    <el-card v-if="nowRam">
                        <div slot="header" class="clearfix">
                            <span>买入/卖出RAM</span>
                        </div>
                        <el-form ref="form3" :model="form3" label-width="100px">
                            <el-form-item label="支付EOS">
                                <el-input v-model="form3.buynum" placeholder="必须是四位小数的数字"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click.native="buyRamBytes">购买</el-button>
                            </el-form-item>
                            <el-form-item label="卖出Bytes" style="margin-top: 50px;">
                                <el-input v-model="form3.sellnum" placeholder="必须是整数"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click.native="sellRamBytes">卖出</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                    <el-card v-if="nowBW">
                        <div slot="header" class="clearfix">
                            <span>抵押/解除BW</span>
                        </div>
                        <el-form ref="form4" :model="form4" label-width="110px">
                            <el-form-item label="抵押EOS - NET">
                                <el-input v-model="form4.buyNet" placeholder="必须是四位小数的数字"></el-input>
                            </el-form-item>
                            <el-form-item label="抵押EOS - CPU">
                                <el-input v-model="form4.buyCpu" placeholder="必须是四位小数的数字"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click.native="delegateBW">抵押</el-button>
                            </el-form-item>
                            <el-form-item label="赎回EOS - NET">
                                <el-input v-model="form4.sellNet" placeholder="必须是四位小数的数字"></el-input>
                            </el-form-item>
                            <el-form-item label="赎回EOS - CPU">
                                <el-input v-model="form4.sellCpu" placeholder="必须是四位小数的数字"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click.native="undelegateBW">赎回</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-main>
            </el-container>
        </div>
        <el-dialog title="添加账户" :visible.sync="showAddUser">
            <el-form ref="form2" :model="form2" label-position="left">
                <el-form-item label="输入私钥" label-width="80px" prop="key"
                              :rules="[ { required: true, message: '请输入私钥', trigger: 'change' } ]">
                    <el-input v-model="form2.key" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddUser = false">取 消</el-button>
                <el-button type="primary" @click="submitForm2">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    /* eslint-disable no-undef */

    let Eos = require('eosjs')
    let ecc = require('eosjs-ecc')
    export default {
        name: 'Wallet',
        data() {
            return {
                config: config,
                loading: false,
                showAddUser: false,
                nowAccount: null,
                accounts: [],
                sysToken: {
                    account: 'eosio.token',
                    name: 'EOS',
                    balance: 0,
                    isSys: true
                },
                userToken: userToken,
                nowToken: null,
                nowRam: false,
                nowBW: false,
                form1: {
                    to: '',
                    number: '',
                    memo: ''
                },
                form2: {
                    key: ''
                },
                form3: {
                    buynum: '',
                    sellnum: ''
                },
                form4: {
                    buyNet: '',
                    buyCpu: '',
                    sellNet: '',
                    sellCpu: ''
                }
            }
        },
        created: function () {
            let self = this
            let hasAccs = self.$cookies.isKey('disTokenAccounts')
            if (hasAccs) {
                self.accounts = JSON.parse(self.$cookies.get('disTokenAccounts'))
                // if (self.accounts.length > 0) {
                //   self.accountClick(self.accounts[0])
                // }
            }
        },
        methods: {
            accountClick: function (acc) {
                let self = this
                self.nowAccount = acc
                if (self.nowAccount != null) {
                    self.getAccount(acc)
                    self.getSysBalance()
                    self.getUserBalance()
                    self.nowToken = null
                    self.nowRam = false
                    self.nowBW = null
                }
            },
            tokenClick: function (tk) {
                let self = this
                self.nowToken = tk
                self.nowRam = false
                self.nowBW = null
                self.form1.to = ''
                self.form1.number = ''
                self.form1.memo = ''
            },
            ramClick: function () {
                let self = this
                self.nowToken = null
                self.nowRam = true
                self.nowBW = null
                self.form3.buynum = ''
                self.form3.sellnum = ''
            },
            BWClick: function () {
                let self = this
                self.nowToken = null
                self.nowRam = null
                self.nowBW = true
                self.form4.buyNet = ''
                self.form4.buyCpu = ''
                self.form4.sellNet = ''
                self.form4.sellCpu = ''
            },
            getByteSize: function (net) {
                let len = 2
                let s = ''
                if (net < 1024) {
                    s = net.toFixed(len).toString() + 'B'
                } else {
                    net /= 1024
                    if (net < 1024) {
                        s = net.toFixed(len).toString() + 'KB'
                    } else {
                        net /= 1024
                        if (net < 1024) {
                            s = net.toFixed(len).toString() + 'MB'
                        } else {
                            net /= 1024
                            if (net < 1024) {
                                s = net.toFixed(len).toString() + 'GB'
                            } else {
                                net /= 1024
                                s = net.toFixed(len).toString() + 'TB'
                            }
                        }
                    }
                }
                return s
            },
            getTimeSize: function (net) {
                let len = 2
                let s = ''
                if (net < 1000) {
                    s = net.toFixed(len).toString() + 'ns'
                } else {
                    net /= 1000
                    if (net < 1000) {
                        s = net.toFixed(len).toString() + 'ms'
                    } else {
                        net /= 1000
                        if (net < 60) {
                            s = net.toFixed(len).toString() + 'sec'
                        } else {
                            net /= 60
                            if (net < 60) {
                                s = net.toFixed(len).toString() + 'min'
                            } else {
                                net /= 60
                                s = net.toFixed(len).toString() + 'hr'
                            }
                        }
                    }
                }
                return s
            },
            openForm2: function () {
                this.form2.key = ''
                this.showAddUser = true
            },
            submitForm2: function () {
                let self = this
                self.$refs['form2'].validate((valid) => {
                    if (valid) {
                        self.getAccountNameFromKey()
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            getAccountNameFromKey: function () {
                let self = this
                let config = self.config
                let eos = Eos(config)
                let key = self.form2.key
                let pub = ecc.privateToPublic(key)
                let acc = {
                    name: '',
                    key: key,
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
                        self.$cookies.set('disTokenAccounts', JSON.stringify(self.accounts))
                    } else {
                        alert('你牛逼')
                    }
                    self.showAddUser = false
                }).catch(error => {
                    console.log(error)
                })
            },
            removeAccount: function () {
                let self = this
                for (let i in self.accounts) {
                    let obj = self.accounts[i]
                    if (obj.name === self.nowAccount.name) {
                        self.accounts.splice(i, 1)
                    }
                }
                self.nowAccount = null
                self.$cookies.set('disTokenAccounts', JSON.stringify(self.accounts))
            },
            getAccount: function (acc) {
                let self = this
                let config = self.config
                config.keyProvider = acc.key
                let eos = Eos(config)
                eos.getAccount({
                    account_name: acc.name
                }).then(result => {
                    // cpu
                    let cpu = {
                        max: self.getTimeSize(Number.parseFloat(result.cpu_limit.max)),
                        available: self.getTimeSize(Number.parseFloat(result.cpu_limit.available)),
                        used: self.getTimeSize(Number.parseFloat(result.cpu_limit.used))
                    }
                    // net
                    let net = {
                        max: self.getByteSize(Number.parseFloat(result.net_limit.max)),
                        available: self.getByteSize(Number.parseFloat(result.net_limit.available)),
                        used: self.getByteSize(Number.parseFloat(result.net_limit.used))
                    }
                    // ram
                    let ram = {
                        ram_quota: self.getByteSize(result.ram_quota),
                        ram_usage: self.getByteSize(result.ram_usage)
                    }
                    acc.ram = ram
                    acc.net = net
                    acc.cpu = cpu
                }).catch(error => {
                    console.log(error)
                })
            },
            getSysBalance: function () {
                let self = this
                let config = self.config
                config.keyProvider = self.nowAccount.key
                let eos = Eos(config)
                eos.getCurrencyBalance({
                    code: self.sysToken.account,
                    account: self.nowAccount.name,
                    symbol: self.sysToken.name
                }).then(result => {
                    if (result.length === 0) {
                        self.sysToken.balance = 0
                    } else {
                        self.sysToken.balance = Number.parseFloat(result[0].split(' EOS')[0])
                    }
                }).catch(error => {
                    console.log(error)
                    self.sysToken.balance = 0
                })
            },
            getUserBalance: function () {
                let self = this
                let config = self.config
                config.keyProvider = self.nowAccount.key
                let eos = Eos(config)
                for (let i in self.userToken) {
                    let token = self.userToken[i]
                    eos.getCurrencyBalance({
                        code: token.account,
                        account: self.nowAccount.name,
                        symbol: token.name
                    }).then(result => {
                        if (result.length === 0) {
                            token.balance = 0
                        } else {
                            token.balance = Number.parseFloat(result[0].split(` ${token.name}`)[0])
                        }
                    }).catch(error => {
                        console.log(error)
                        token.balance = 0
                    })
                }
            },
            transferBalance: function () {
                let self = this
                if (self.nowAccount != null && self.nowToken != null && self.form1.to !== '' && Number.parseFloat(self.form1.number) > 0) {
                    self.loading = true
                    let config = self.config
                    config.keyProvider = self.nowAccount.key
                    let eos = Eos(config)
                    let quantity = self.form1.number.toString() + ' ' + self.nowToken.name
                    if (self.nowToken.isSys) {
                        eos.transfer(self.nowAccount.name, self.form1.to, quantity, self.form1.memo).then(() => {
                            self.loading = false
                            self.form1.to = ''
                            self.form1.number = ''
                            self.form1.memo = ''
                            self.getAccount(self.nowAccount)
                            self.getSysBalance()
                            self.getUserBalance()
                        }).catch(error => {
                            self.loading = false
                            console.log(error)
                            self.getAccount(self.nowAccount)
                            self.getSysBalance()
                            self.getUserBalance()
                        })
                    } else {
                        eos.contract(self.nowToken.account).then(con => {
                            con.transfer(self.nowAccount.name, self.form1.to, quantity, self.form1.memo).then(() => {
                                self.loading = false
                                self.form1.to = ''
                                self.form1.number = ''
                                self.form1.memo = ''
                                self.getAccount(self.nowAccount)
                                self.getSysBalance()
                                self.getUserBalance()
                            }).catch(error => {
                                self.loading = false
                                console.log(error)
                                self.getAccount(self.nowAccount)
                                self.getSysBalance()
                                self.getUserBalance()
                            })
                        }).catch(error => {
                            self.loading = false
                            console.log(error)
                            self.getAccount(self.nowAccount)
                            self.getSysBalance()
                            self.getUserBalance()
                        })
                    }
                }
            },
            buyRamBytes: function () {
                let self = this
                if (self.nowAccount != null && self.form3.buynum !== '' && Number.parseFloat(self.form3.buynum) > 0) {
                    self.loading = true
                    let config = self.config
                    config.keyProvider = self.nowAccount.key
                    let eos = Eos(config)
                    let quantity = self.form3.buynum.toString() + ' EOS'
                    eos.buyram(self.nowAccount.name, self.nowAccount.name, quantity).then(() => {
                        self.loading = false
                        self.form3.buynum = ''
                        self.getAccount(self.nowAccount)
                        self.getSysBalance()
                        self.getUserBalance()
                    }).catch(error => {
                        self.loading = false
                        console.log(error)
                        self.getAccount(self.nowAccount)
                        self.getSysBalance()
                        self.getUserBalance()
                    })
                }
            },
            sellRamBytes: function () {
                let self = this
                if (self.nowAccount != null && self.form3.sellnum !== '' && Number.parseInt(self.form3.sellnum) > 0) {
                    self.loading = true
                    let config = self.config
                    config.keyProvider = self.nowAccount.key
                    let eos = Eos(config)
                    let num = Number.parseInt(self.form3.sellnum)
                    eos.sellram(self.nowAccount.name, num).then(() => {
                        self.loading = false
                        self.form3.sellnum = ''
                        self.getAccount(self.nowAccount)
                        self.getSysBalance()
                        self.getUserBalance()
                    }).catch(error => {
                        self.loading = false
                        console.log(error)
                        self.getAccount(self.nowAccount)
                        self.getSysBalance()
                        self.getUserBalance()
                    })
                }
            },
            delegateBW: function () {
                let self = this
                if (self.nowAccount != null && self.form4.buyNet !== '' && Number.parseFloat(self.form4.buyNet) > 0 && self.form4.buyCpu !== '' && Number.parseFloat(self.form4.buyCpu) > 0) {
                    self.loading = true
                    let config = self.config
                    config.keyProvider = self.nowAccount.key
                    let eos = Eos(config)
                    let quantity1 = self.form4.buyNet.toString() + ' EOS'
                    let quantity2 = self.form4.buyCpu.toString() + ' EOS'
                    eos.delegatebw(self.nowAccount.name, self.nowAccount.name, quantity1, quantity2, 0).then(() => {
                        self.loading = false
                        self.form4.buyNet = ''
                        self.form4.buyCpu = ''
                        self.getAccount(self.nowAccount)
                        self.getSysBalance()
                        self.getUserBalance()
                    }).catch(error => {
                        self.loading = false
                        console.log(error)
                        self.getAccount(self.nowAccount)
                        self.getSysBalance()
                        self.getUserBalance()
                    })
                }
            },
            undelegateBW: function () {
                let self = this
                if (self.nowAccount != null && self.form4.sellNet !== '' && Number.parseFloat(self.form4.sellNet) > 0 && self.form4.sellCpu !== '' && Number.parseFloat(self.form4.sellCpu) > 0) {
                    self.loading = true
                    let config = self.config
                    config.keyProvider = self.nowAccount.key
                    let eos = Eos(config)
                    let quantity1 = self.form4.sellNet.toString() + ' EOS'
                    let quantity2 = self.form4.sellCpu.toString() + ' EOS'
                    eos.undelegatebw(self.nowAccount.name, self.nowAccount.name, quantity1, quantity2).then(() => {
                        self.loading = false
                        self.form4.buyNet = ''
                        self.form4.buyCpu = ''
                        self.form4.sellNet = ''
                        self.form4.sellCpu = ''
                        self.getAccount(self.nowAccount)
                        self.getSysBalance()
                        self.getUserBalance()
                    }).catch(error => {
                        self.loading = false
                        console.log(error)
                        self.getAccount(self.nowAccount)
                        self.getSysBalance()
                        self.getUserBalance()
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .index-box {
        display: flex;
    }

    .index-account-button {
        width: 200px;
        font-size: 18px;
        margin-left: 10px;
    }

    .index-account-button:first-child {
        margin-left: 0px;
    }

    .index-main {
        margin: 20px 0px 0px 0px;
    }

    .index-main-left {
        float: left;
    }

    .index-main-left-split {
        color: #2b85e4;
        border-bottom: #e5e5e5 1px solid;
        padding-bottom: 10px;
        text-align: left;
        font-size: 16px;
    }

    .index-main-left-token {
        margin-top: 20px;
        text-align: left;
        font-size: 18px;
        color: #303133;
        display: flex;
        cursor: pointer;
    }

    .index-main-center {
        float: left;
        text-align: left;
        padding: 0 0 0 20px;
    }
</style>

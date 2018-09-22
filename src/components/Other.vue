<template>
    <div class="hello" style="width: 100%; padding: 15px; max-width: 600px; margin: 0 auto;">
        <h1>{{ msg }}</h1>
        <!--<el-button @click="getKeys">点我</el-button>-->
        <mu-button color="primary" @click="getKeys">点我</mu-button>
        <div>
            <!--<el-input v-model="form.privateKey" style="text-align: center;"></el-input>-->
            <!--<el-input v-model="form.publicKey" style="text-align: center; margin-top: 20px;"></el-input>-->
            <mu-form :model="form" label-width="80">
                <mu-form-item prop="input" label="私钥">
                    <mu-text-field v-model="form.privateKey"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="input" label="公钥">
                    <mu-text-field v-model="form.publicKey"></mu-text-field>
                </mu-form-item>
            </mu-form>
        </div>
    </div>
</template>

<script>
    let ecc = require('eosjs-ecc')
    export default {
        name: 'Other',
        data() {
            return {
                loading: false,
                msg: 'EOS 秘钥生成工具',
                form: {
                    privateKey: '',
                    publicKey: ''
                }
            }
        },
        created: function () {
            let self = this
            self.$emit('setTop', {title: 'DisToken', back: false, add: false, qr: false, path: '2'})
        },
        methods: {
            getKeys: function () {
                let self = this
                self.loading = true
                ecc.randomKey().then(privateKey => {
                    let result = {
                        privateKey: privateKey,
                        publicKey: ecc.privateToPublic(privateKey)
                    }
                    self.form = result
                    self.loading = false
                })
            }
        }
    }
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }
</style>

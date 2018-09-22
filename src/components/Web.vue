<template>
    <div class="scroll-wrapper">
        <iframe :src="getAddress()" frameborder=0>

        </iframe>
    </div>
</template>

<script>
    export default {
        name: 'Web',
        data() {
            return {
                trackerAddress: trackerAddress,
                trx_id: ''
            }
        },
        created: function () {
            let self = this
            self.$emit('setTop', {title: 'DisToken', back: false, add: false, qr: false, path: '2'})
            self.trx_id = self.$route.params.trx_id
        },
        methods: {
            getAddress: function () {
                let self = this
                if (self.trx_id == undefined || self.trx_id == '') {
                    return self.trackerAddress
                } else {
                    return self.trackerAddress + 'Transaction/' + self.trx_id
                }
            }
        }
    }
</script>

<style scoped>
    iframe {
        margin: 0;
        width: 100%;
        height: 100%;
        display: block;
        vertical-align: bottom;
    }

    .scroll-wrapper {
        -webkit-overflow-scrolling: touch;
        overflow: auto;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 56px;
        bottom: 56px;
        left: 0;
        right: 0;
        padding: 0;
    }
</style>

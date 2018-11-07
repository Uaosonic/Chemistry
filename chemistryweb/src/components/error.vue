<template>
    <div class="container">
        <h2>登录超时</h2>
        <h2>请重新登录！</h2>
        <div class="center">
            <button type="button" class="btn btn-success" @click="teacher">老师登录</button>
            <button type="button" class="btn btn-info" @click="student">学生登录</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'error',
    methods: {
        teacher: function(){
            window.location.href='http://47.93.197.5/teacherQuesManger/login.html';
        },
        student: function(){
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
    .center {
        text-align: center;
        margin-top: 20px;
    }
    .center button {
        margin: 0 10px;
    }
</style>


<template>
  <div class="container">
    <h2>东北师范大学化学学院答题系统</h2>
      <form class="form-signin">
          <h4 class="form-signin-heading">请登录</h4>
          <label for="inputStuno" class="sr-only">学号</label>
          <input type="text" id="inputStuno" v-model="username" class="form-control" autocomplete="username" placeholder="学号" required="" autofocus="">
          <label for="inputPassword" class="sr-only">密码</label>
          <input type="password" id="inputPassword" v-model="password" autocomplete="current-password" class="form-control" placeholder="密码" required="">
          <button class="btn btn-lg btn-primary btn-block" v-on:click="submit" type="button">登录</button>
        </form>
    </div>
</template>

<script>
export default {
  name: 'Loginin',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    submit: function () {
      this.axios.post('/loginReginster/login',this.$qs.stringify({username: this.username, password: this.password}))
      .then(res => {
        if(res.data.level == 0){      
          this.$router.push('/selectCourse');
        }
        else if(res.data.level == 1){
          window.location.href='http://47.93.197.5/teacherMobile/demo1.html';
        }
      }, res => {
          console.log(res.data.status);
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

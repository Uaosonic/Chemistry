<template>
    <div class="container">
      <h4>请选择课程</h4>
		  <button class="btn btn-primary btn-lg btn-block" @click="chooseCourse(item.courseId)" v-for="item in courseList">{{item.courseName}}</button>
	</div>
</template>

<script>
export default {
    name: 'selectCourse',
    data () {
    return {
      courseList: []
    }
  },
  mounted: function(){
    this.getCourseList();
  },
  methods: {
    getCourseList: function () {
      this.axios.get('/course/getAllCourse')
      .then(res => {
        console.log(res.data);
        this.courseList = res.data;
      }, res => {
          console.log(res);
      })
    },
    chooseCourse: function(courseId){
      console.log(courseId);
      this.axios.get('/loginReginster/selectCourse',{params:{courseId: courseId}})
      .then(res => {
        if(res.data.status == 1){
          this.$router.push('/choice');
        }
      }, res => {
          console.log(res.data.status);
      })
    }
  }
}
</script>

<style scoped>
    .btn {
        margin-top: 20px;
    }
</style>



<template>
    <div class="container">
        <div id="searchQues">
            <span class="help-block">请选择章：</span>
            <select id="searchCha" class="form-control"  @change="changeSession($event)">
                <option v-for="chapter in Chapter" v-bind:value="chapter.chapterId">{{chapter.chapterName}}</option>
            </select>

            <span class="help-block">请选择节：</span>
            <select id="searchSec" class="form-control">
                <option v-for="section in Section" v-bind:value="section.sessionId">{{section.sessionName}}</option>
            </select>

            <button class="btn btn-primary btn-lg btn-block" @click="searchQues" style="margin: 20px 0px;">查询</button>
        </div>
       
        <div class="form-choice">
            <div class="choiceBlock" v-for="(item,index) in Exercise">
                <template v-if="item.type == 0">
                    <p class="choiceQuestion"><em>选择题：{{item.choiceQuesId}}. </em>{{item.quesDescription}}</p>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.choiceQuesId" value="A"><span class="radio-show"></span>A.{{item.optionA}}</label>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.choiceQuesId" value="B"><span class="radio-show"></span>B.{{item.optionB}}</label>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.choiceQuesId" value="C"><span class="radio-show"></span>C.{{item.optionC}}</label>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.choiceQuesId" value="D"><span class="radio-show"></span>D.{{item.optionD}}</label>
                </template>
                <template v-else-if="item.type == 1">
                    <p class="choiceQuestion"><em>判断题：{{item.judgmentQuesId}}. </em> {{item.judgQuesDescription}}</p>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.judgmentQuesId"  value="对"><span class="radio-show"></span>对</label>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.judgmentQuesId"  value="错"><span class="radio-show"></span>错</label>
                </template>
            </div>
            <button class="btn btn-primary btn-lg btn-block" @click="subQues">点击提交</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'choice',
    data() {
        return {
            Exercise: [],
            Chapter: [],
            Section: [],
            Answer: []
        }
    },
    mounted: function(){
        this.getChapter();
        this.getOpenQues();
    },
    methods: {
        getChapter: function(){
            this.axios.get('ques/student/getChapter')
            .then(res => {
                console.log(res.data);
                this.Chapter = res.data;
                this.getSession(this.Chapter[0].chapterId);
            }, res => {
                console.log(res)
            })
        },
        getSession: function(chapterId){
            console.log(chapterId);
            this.axios.get('/ques/getSession',{params:{chapterId: chapterId}})
            .then(res => {
                console.log(res.data);
                this.Section = res.data;
            }, res => {
                console.log(res);
            })
        },
        getOpenQues: function(){
            this.axios.get('/answer/student/getOpenQues')
            .then(res => {
                this.Exercise = res.data;
            }, res => {
                console.log(res);
            })
        },
        changeSession: function(event){
            this.axios.get('/ques/getSession',{params:{chapterId: event.target.value}})
            .then(res => {
                console.log(res.data);
                this.Section = res.data;
            }, res => {
                console.log(res);
            })
        },
        searchQues: function(){
            let theCha = document.querySelector('#searchCha').value;
            let theSec = document.querySelector('#searchSec').value;
            this.axios.get('/answer/student/searchOpenQues',{params:{chapterId: theCha, sessionId: theSec}})
            .then(res => {
                this.Exercise = res.data;
            }, res => {
                console.log(res);
            })
        },
        subQues: function(){
            var that = this;
            var flag = 0; 
            this.Exercise.forEach((value,index) => {
                if(value.type == 0){
                    let radios = document.getElementsByName(value.type+'|'+value.choiceQuesId);
                    for(let i=0;i<radios.length;i++){
                        if(radios[i].checked){
                            that.$set(that.Answer,index,{type:value.type, quesId:value.choiceQuesId, stuAnswer:radios[i].value})
                            flag = flag + 1;
                        }
                    }
                }
                else if(value.type == 1){
                    let radios = document.getElementsByName(value.type+'|'+value.judgmentQuesId);
                    for(let i=0;i<radios.length;i++){
                        if(radios[i].checked){
                            that.$set(that.Answer,index,{type:value.type, quesId:value.judgmentQuesId, stuAnswer:radios[i].value})
                            flag = flag + 1;
                        }
                    }
                }
            })
            console.log(this.Answer);
            if(flag == this.Exercise.length){
                this.axios.post('/answer/student/submitAnswer',this.Answer)
                .then(res => {
                    console.log(res.data);
                    alert("提交成功！");
                }, res => {
                    console.log(res);
                    alert(res);
                })
            }   
        }
    } 
}
</script>

<style scoped>
    .btn {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .panel-body {
        padding: 10px;
    }
</style>
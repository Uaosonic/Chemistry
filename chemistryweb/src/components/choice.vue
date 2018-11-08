<template>
    <div class="container">
        <template v-if="showDialog === true">
            <div class="dialog">
                <div class="mask"></div>
                <div class="dialog-content">
                    <h3 class="title">答题结果</h3>
                    <p class="text">正确题目数量：{{result.correctCount}}道</p>
                    <p class="text">错误题目数量：{{result.errorCount}}道</p>
                    <div class="btn-group">
                        <div class="btn" @click="close">确定</div>
                    </div>
                </div>
            </div>
        </template>
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
       <div class="loading" v-show="loadFlag">
           <div class="circle loader"></div>
       </div>
        <div class="form-choice">
            <div class="choiceBlock" v-for="(item,index) in Exercise">
                <template v-if="item.type == 0">
                    <p class="choiceQuestion"><em>选择题：{{item.choiceQuesId}}. </em><span v-html="item.quesDescription">{{item.quesDescription}}</span></p>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.choiceQuesId" value="A" v-bind:disabled="isDisable"><span class="radio-show"></span>A.<span v-html="item.optionA">{{item.optionA}}</span></label>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.choiceQuesId" value="B" v-bind:disabled="isDisable"><span class="radio-show"></span>B.<span v-html="item.optionB">{{item.optionB}}</span></label>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.choiceQuesId" value="C" v-bind:disabled="isDisable"><span class="radio-show"></span>C.<span v-html="item.optionC">{{item.optionC}}</span></label>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.choiceQuesId" value="D" v-bind:disabled="isDisable"><span class="radio-show"></span>D.<span v-html="item.optionD">{{item.optionD}}</span></label>
                </template>
                <template v-else-if="item.type == 1">
                    <p class="choiceQuestion"><em>判断题：{{item.judgmentQuesId}}. </em> <span v-html="item.judgQuesDescription">{{item.judgQuesDescription}}</span></p>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.judgmentQuesId" value="对" v-bind:disabled="isDisable"><span class="radio-show"></span>对</label>
                    <label class="option"><input type="radio" class="radio-hidden" v-bind:name="item.type+'|'+item.judgmentQuesId" value="错" v-bind:disabled="isDisable"><span class="radio-show"></span>错</label>
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
            Answer: [],
            result: {},
            showDialog: false,
            isDisable: false,
            loadFlag: true
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
                this.Section = res.data;
            }, res => {
                console.log(res);
            })
        },
        getOpenQues: function(){
            this.axios.get('/answer/student/getOpenQues')
            .then(res => {
                this.Exercise = res.data;
                this.loadFlag = false;
            }, res => {
                console.log(res);
            })
        },
        changeSession: function(event){
            this.axios.get('/ques/getSession',{params:{chapterId: event.target.value}})
            .then(res => {
                this.Section = res.data;
            }, res => {
                console.log(res);
            })
        },
        searchQues: function(){
            let theCha = document.querySelector('#searchCha').value;
            let theSec = document.querySelector('#searchSec').value;
            this.loadFlag = true;
            this.axios.get('/answer/student/searchOpenQues',{params:{chapterId: theCha, sessionId: theSec}})
            .then(res => {
                this.Exercise = res.data;
                this.loadFlag = false;
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
                if(this.isDisable === false) {
                    this.axios.post('/answer/student/submitAnswer',this.Answer)
                    .then(res => {
                        this.result = res.data;
                        this.showDialog = true;
                        this.isDisable = true;
                    }, res => {
                        console.log(res);
                    })
                }
                else {
                    this.showDialog = true;
                }
            }
            else {
                alert("请确认答完所有题目后再进行提交！")
            } 
        },
        close: function(){
            this.showDialog = false;
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
    .dialog {
        position: relative;
    }
    .dialog .mask {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 50001;
        background: rgba(0,0,0,.5);
    }
    .dialog .dialog-content {
        position: fixed;
        box-sizing: border-box;
        padding: 20px;
        width: 80%;
        min-height: 140px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        background: #fff;
        z-index: 50002;
    }
    .dialog .dialog-content .title {
        font-size: 16px;
        font-weight: 600;
        line-height: 30px;
    }
    .dialog .dialog-content .text {
        font-size: 14px;
        line-height: 30px;
        color: #555;
        margin-bottom: 0rem;
    }
    .dialog .dialog-content .text:last-of-type {
        margin-bottom: 1rem;
    }
    .dialog .dialog-content .btn-group {
        display: flex;
        position: absolute;
        right: 0;
        bottom: 10px;
    }
    .dialog .dialog-content .btn-group .btn {
        padding: 10px 20px;
        font-size: 14px;
        margin-bottom: 0px;
        margin-top: 0px;
    }
    .loading {
        margin: 15px auto;
        text-align: center;
    }
    .loader {
        background: linear-gradient(to right, rgb(22, 113, 202) 50%, transparent 50%);
        animation: spin 1s infinite linear;
    }
    .circle {
        display: inline-block;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        box-shadow: 4px -40px 60px 5px rgb(26, 117, 206) inset;
    }
    .loader:before {
        display: block;
        content: '';
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90px;
        height: 90px;
        background-color: #eee;
        border-radius: 50%;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>
<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <el-button style="position: relative;  top:-11px;  background-color:#909399; border:0px; border-radius:5px" size="mini" round v-loading="loading"  type="success" @click="submitForm">
          保存
        </el-button>
      </sticky>

      <!-- 修改区 -->
      <div class="createPost-main-container">

        <!-- 内容修改区 -->
        <div class="my-common-card">

          <el-row>
            <el-col :span="24">
              <div class="font16" >工单标题</div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 20px" prop="title">
                <MDinput v-model="postForm.title" :maxlength="100" name="name" required/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <div class="font16" >工单内容</div>
            </el-col>
          </el-row>

          <el-row style="margin-top: 8px">
            <el-col :span="24">
              <el-form-item prop="content" style="margin-bottom: 30px;">

                <el-input
                  type="textarea"
                  :autosize="{ minRows: 15, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="postForm.content">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </div>


        <!-- 附件修改区 -->
        <div class="my-common-card">

          <div class="font26" style="margin-bottom: 16px">
              工单附件
          </div>
          <div>
            <div class="attachmentItem" v-if="!workOrder.attachmentName">该工单没有附件</div>
            <div class="attachmentItem" v-else>
              <div>
                <h4>
                  {{ workOrder.attachmentName }}
                </h4>
                <span>{{ workOrder.attachmentSize }}KB</span>
              </div>

              <div class="opt">
                <el-button @click="downloadAttachment()" type="primary" icon="el-icon-download" circle/>
                <el-button @click="deleteAttachment()" type="danger" icon="el-icon-delete" circle/>
              </div>
            </div>
          </div>

          <el-upload
            class="uploadArea"
            id="upload"
            ref="upload"
            drag
            multiple
            :limit="100"
            :file-list="attachmentList"
            action="#"
            :http-request="uploadFile"
            :auto-upload="false"
            :on-change="upload_change"
            :on-remove="upload_remove"
          >
            <!--:on-exceed="upload_exceed"-->
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击选取</em>
            </div>
          </el-upload>

        </div>


      </div>


    </el-form>
  </div>
</template>

<script>

import page from "./edit.js"

export default page

</script>

<style scoped>

/*标题输入框圆角*/
/deep/ .material-input__component {
  border-radius: 15px
}

/deep/ .material-input__component .material-input {
  border-bottom: 1px solid transparent;
  padding: 5px 12px 5px 12px;
}

/deep/ .material-input__component {
  margin-top: 8px;
}



.attachmentArea {
  border: 1px solid #dadce0;
  border-radius: 5px;
  padding: 16px;
}

.attachmentItem {
  margin-bottom: 16px;
  padding: 16px;
  display: flex;
  border-radius: 5px;
  border: 1px solid #dadce0;
  /*border-style: solid;*/
  justify-content: space-between;
}


h4 {

  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  border: 0;
  padding: 0;
  margin: 0;
}

.opt {
  color: #3a8ee6;
}

.font24 {
  font-size: 24px;
}

.font16 {
  font-size: 16px;
}

.my-common-card {
  border: 0px solid;
  border-radius: 15px;
  padding: 16px;
  margin: 16px;
  background-color: #eeeeee;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}


/*内容输入框圆角、内边距*/
/deep/ .el-textarea__inner {
  border-radius: 15px;
  padding: 5px 12px;
  border: 0px
}


.myButton{
  border-radius:20px
}

/deep/ .uploadArea>.el-upload {
  display: block;
}


/deep/ .uploadArea>.el-upload>.el-upload-dragger {
  width: auto;
  /*height: 180px;*/
}

</style>

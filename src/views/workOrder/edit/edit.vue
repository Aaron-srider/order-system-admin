<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          保存
        </el-button>
      </sticky>

      <!-- 修改区 -->
      <div class="createPost-main-container">

        <!-- 内容修改区 -->
        <div class="workOrderContent">


          <el-row>
            <el-col :span="24">
              <div class="font24" style="margin-bottom: 16px">标题内容</div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" prop="title">
                <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                  Title
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
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
        <div class="attachment">

          <div class="font24" style="margin-bottom: 16px">工单附件</div>
          <div id="attachmentItem" >
            <div v-if="!workOrder.attachmentName">该工单没有附件</div>
            <div class="attachmentItem" v-else>
              <div>
                <h4>
                  {{workOrder.attachmentName}}
                </h4>
                <span>{{workOrder.attachmentSize}}KB</span>
              </div>

              <div class="opt">
                <el-button @click="downloadAttachment()" type="primary" icon="el-icon-download" circle/>
                <el-button @click="downloadAttachment()" type="danger" icon="el-icon-delete" circle/>
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

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .attachment {
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

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea ::v-deep {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
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

  .workOrderContent {
    border: 1px solid #dadce0;
    border-radius: 5px;
    padding: 16px;

    margin-bottom: 16px;
  }


</style>

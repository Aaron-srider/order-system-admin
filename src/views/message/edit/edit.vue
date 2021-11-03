<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">




      <!-- 修改区 -->
      <div class="createPost-main-container">

        <!-- 内容修改区 -->
        <div class="workOrderContent">

          <el-row>
            <el-col :span="24">
              <div class="font24" style="margin-bottom: 16px">修改区</div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 0px;" prop="title">
                <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                  标题
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item prop="content" style="margin-bottom: 30px;">
                <div class="material-label">
                  内容
                </div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 15, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="postForm.content">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="editPageOpt">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
            保存
          </el-button>
        </div>

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

  .editPageOpt {
    text-align: right;

  }

  .material-label {
    font-weight: bold;
    /*position: absolute;*/
    pointer-events: none;
    /*left: 0;*/
    /*top: 0;*/
    transition: 0.2s ease all;
    font-size: 16px;
    color: #9E9E9E
  }

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

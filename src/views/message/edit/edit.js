import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import {validURL} from '@/utils/validate'
import Warning from './Warning'
import {CommentDropdown, PlatformDropdown, SourceUrlDropdown} from './Dropdown'
import * as workOrderApi from '@/api/workOrder.js'
import {handleWorkOrder} from "@/utils/workOrder";

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
}

export default {
  name: 'ArticleDetail',
  components: {Tinymce, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  mounted() {

    console.log("========edit========")
    this.workOrderId = this.$route.params.workOrderId

    workOrderApi.getAllWorkOrders({id: this.workOrderId})
      .then((res) => {
        console.log(res);
        this.workOrder = handleWorkOrder(res.data.result.records[0])
        this.postForm.title = this.workOrder.workOrderTitle
        this.postForm.content = this.workOrder.workOrderContent
      })
  },

  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {

        this.notifyPromise = this.notifyPromise.then(this.$nextTick).then(() => {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
        });

        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }

    return {
      workOrderId: undefined,
      notifyPromise: Promise.resolve(),
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        title: [{validator: validateRequire}],
        content: [{validator: validateRequire}],
      },
      tempRoute: {},
      attachmentList: [],
      uploadAttachmentList: [],
      workOrder: {}
    }
  },

  methods: {
    downloadAttachment() {
      workOrderApi.downloadWorkOrderAttachment(this.workOrderId)
        .then((res) => {

          const { data, headers } = res
          const fileName = headers['content-disposition'].replace(/\w+; fileName=(.*)/, '$1')
          // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
          //const blob = new Blob([JSON.stringify(data)], ...)
          const blob = new Blob([data], {type: headers['content-type']})
          let dom = document.createElement('a')
          let url = window.URL.createObjectURL(blob)
          dom.href = url
          dom.download = decodeURI(fileName)
          dom.style.display = 'none'
          document.body.appendChild(dom)
          dom.click()
          dom.parentNode.removeChild(dom)
          window.URL.revokeObjectURL(url)
        })
    },

    /**
     * 文件上传错误提示
     * @param msg 错误信息
     */
    notify_self(msg, type) {
      this.notifyPromise = this.notifyPromise.then(this.$nextTick).then(() => {
        this.$notify({
          title: `${type === 'size' ? '文件大小不合规' : '文件数量不合规'}`,
          message: msg,
          iconClass: "el-icon-s-opportunity",
          customClass: "notify_size",
          duration: 5000
        });
      });
    },

    /**
     * 选中文件后判断大小是否合规
     * @param file 文件，对象的row属性是一个文件
     * @param fileList 文件列表，注意，该文件列表中，每个文件对象的row属性不符合要求
     */
    upload_change: function (file, fileList) {
      // 判断 > 10M
      if (file.size > 1024 * 1024 * 10) {
        fileList.pop();
        let msg_size = `您上传的${file.name}，该文件大于10M，请您重新上传。`;
        this.notify_self(msg_size, "size");
        return false;
      }

      //判断上传文件数 > 1
      if (fileList.length > 1) {
        fileList.pop();
        let msg_size = `您只能上传一个文件。`;
        this.notify_self(msg_size, "count");
        return false;
      }
      this.attachmentList = JSON.parse(JSON.stringify(fileList));
      this.uploadAttachmentList.push(file);
      return true
    },


    upload_remove(file, fileList) {
      console.log(file, fileList)
      this.attachmentList = fileList
      // 不直接赋值是因为打印出来的数据中，如果多个文件删至只剩一个时，该文件的raw为object，不是file
      this.uploadAttachmentList.forEach((item, index) => {
        if (item.name == file.name) {
          this.uploadAttachmentList.splice(index, 1);
        }
      });
    },


    /**
     * 每当提交表单，自动回调该函数上传
     */
    uploadFile() {
      // 传输文件
      let attachment = new FormData();
      this.uploadAttachmentList.forEach((item, index) => {
        attachment.append("attachment", item.raw);
      });

      workOrderApi.uploadWorkOrderAttachment(this.workOrder.workOrderId,
        attachment)
        .then((res) => {
          console.log(res)
        })
    },

    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, {title: `${title}-${this.postForm.id}`})
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true

          const afterUpdateContent = workOrderApi.updateWorkOrder(
            {
              id: this.workOrderId,
              title: this.postForm.title,
              content: this.postForm.content
            })

          if (this.uploadAttachmentList.length > 0) {

            let attachment = new FormData();
            attachment.append("attachment", this.uploadAttachmentList[0].raw);
            const afterUpdateAttachment = workOrderApi.uploadWorkOrderAttachment(
              this.workOrderId,
              attachment
            )

            Promise.all([
              afterUpdateContent,
              afterUpdateAttachment
            ])
              .then((values) => {
                console.log(values);
                this.postForm.status = 'published'
                this.loading = false
                this.$router.go(0)
              });
          } else {
            afterUpdateContent.then((res) => {
              console.log(res);
              this.postForm.status = 'published'
              this.loading = false
              this.$router.go(0)
            });
          }


          // this.$notify({
          //   title: '成功',
          //   message: '发布文章成功',
          //   type: 'success',
          //   duration: 2000
          // })



        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  }
}

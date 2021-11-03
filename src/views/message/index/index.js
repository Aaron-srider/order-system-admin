import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {parseTime} from "@/utils/index.js"; // secondary package based on el-pagination
import {afterEnableWorkOrder, afterInvalidateWorkOrder, handleWorkOrder} from "@/utils/workOrder";


let that;
export default {
  components: {
    Pagination
  },
  filters: {},
  methods: {
    handleFilter() {

    },
    fetchData() {

    }
  },
  data() {
    return {
      list: [
        {
          id: 1,
          senderName: "test1",
          receiverName: "test2",
          createTime: "2020-12-02 22:33:10",
          title: "testTitle1"
        },
        {
          id: 2,
          senderName: "test2",
          receiverName: "test5",
          createTime: "2020-11-15 10:10:31",
          title: "testTitle2"
        },
        {
          id: 3,
          senderName: "test3",
          receiverName: "test6",
          createTime: "2025-07-19 10:10:31",
          title: "testTitle3"
        }
      ],
      listQuery: {
        title: undefined,
        description: undefined,
        senderStudentJobId: undefined,
        receiverStudentJobId: undefined
      },
      page: {
        total: 1,
        current: 1,
        size: 3,
      }
    }
  }
}

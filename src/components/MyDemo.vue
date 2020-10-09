<template>
  <div class="hello" style="text-alin">
    <Layout>
      <Sider
        ref="side"
        hide-trigger
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
      >
        <Menu
          active-name="1-2"
          theme="dark"
          width="auto"
          :class="menuitemClasses"
        >
          <MenuItem name="1-2">
            <Icon type="ios-search"></Icon>
            <span>所有用户</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{ padding: 0 }" class="layout-header-bar">
          <Icon
            @click.native="collapsedSider"
            :class="rotateIcon"
            :style="{ margin: '0 20px' }"
            type="md-menu"
            size="24"
          ></Icon>
          <Dropdown>
            <Button type="primary">
              我的
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="logout()">注销</DropdownItem>
              <DropdownItem @click.native="logoutTest()">测试注销</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Header>
        <Content
          :style="{ margin: '20px', background: '#fff', minHeight: '260px' }"
        >
          <Table border :columns="columns" :data="data">
            <template slot-scope="{ row, index }" slot="name">
              <!-- <input v-bind:placeholder="row.name" @keyup.enter="modifyName($event,index)" /> -->
              <Input
                v-bind:placeholder="row.name"
                @keyup.enter.native="modifyName($event, index)"
              />
            </template>
            <template slot-scope="{ index }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="transferArea(index)"
                :disabled="data[index].id == toTransferId"
                >transfer</Button
              >
              <!-- <Button type="error" size="small" @click="remove(index)">Delete</Button> -->
            </template>
          </Table>
          <Modal
            v-model="modalStatus"
            title="转账"
            @on-ok="ok"
            @on-cancel="cancel"
          >
            <RadioGroup v-model="transferMethod">
              <Radio label="error">
                <span>遇到错误</span>
              </Radio>
              <Radio label="overtime">
                <span>超出时间</span>
              </Radio>
              <Radio label="correct">
                <span>正确提交</span>
              </Radio>
            </RadioGroup>
            <Input placeholder="请输入金额" v-model="money" />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
// import jwt_decode from "jwt-decode";

export default {
  name: "MyDemo",
  props: {
    msg: String,
  },
  components: {},

  data() {
    return {
      isCollapsed: false,
      //转账方式
      transferMethod: "error",
      //弹窗状态
      modalStatus: false,
      //转账人id
      toTransferId: "",
      // toTransferId: jwt_decode(localStorage.getItem("token")).userId,
      //被转账人id
      transferId: -1,
      //转账金额
      money: "",
      //table数据类型
      columns: [
        {
          title: "Name",
          key: "name",
          slot: "name",
        },
        {
          title: "Money",
          key: "money",
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      //table数据
      data: [],
    };
  },
  created() {
    //获取用户id
    this.$axios.get("getUserId",{
       headers: {
          "XX-Token": localStorage.getItem("token"),
        },
    }).then((res) => {
      console.log("用户id：" + res.data);
      this.toTransferId = res.data;
    });
    //页面初始化查询所有user
    this.$axios
      .get("/user", {
        headers: {
          "XX-Token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        this.data = res.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
  },
  methods: {
    ...mapMutations(["delToken"]),
    ...mapGetters(["getUserInfo"]),
    collapsedSider() {
      this.$refs.side.toggleCollapse();
    },
    //测试注销，删除token，返回登陆页面
    logout() {
      this.delToken({ token: "" });
      this.$router.push("/login");
    },
    //测试注销，删除token，不返回登陆页面
    logoutTest() {
      this.delToken({ token: "" });
    },
    //修改名字
    modifyName(ele, index) {
      //获取输入框的值(组件)
      console.log(ele.target.value);
      //获取输入框的值
      console.log(ele.currentTarget.value);
      console.log("session");
      console.log(sessionStorage.getItem("token"));
      //获取当前记录的id
      console.log(this.data[index].id);
      this.$axios
        .get("/modifyName", {
          params: { id: this.data[index].id, name: ele.target.value },
        })
        .then((res) => {
          console.log(res.data);
          //刷新页面
          // this.$router.go(0);
        });
    },
    //开启弹窗并记录被转人id
    transferArea(index) {
      this.modalStatus = true;
      this.transferId = this.data[index].id;
    },
    //弹窗确定方法->执行转账
    ok() {
      console.log(this.money);
      //根据单选框不同选择执行不同的转账请求
      if (this.transferMethod == "error") {
        //错误转账
        this.$axios
          .get("/transferWithError", {
            params: {
              toTransferId: this.toTransferId,
              transferId: this.transferId,
              money: this.money,
            },
          })
          .then((res) => {
            console.log(res.data);
            //刷新页面
            this.$router.go(0);
          });
      } else if (this.transferMethod == "overtime") {
        //超时转账
        this.$axios
          .get("/transferWithOvertime", {
            params: {
              toTransferId: this.toTransferId,
              transferId: this.transferId,
              money: this.money,
            },
          })
          .then((res) => {
            console.log(res.data);
            //刷新页面
            this.$router.go(0);
          });
      } else if (this.transferMethod == "correct") {
        //正确转账
        this.$axios
          .get("/transfer", {
            params: {
              toTransferId: this.toTransferId,
              transferId: this.transferId,
              money: this.money,
            },
          })
          .then((res) => {
            console.log(res.data);
            //刷新页面
            this.$router.go(0);
          });
      }
    },
    //弹窗关闭方法
    cancel() {},
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
.hello {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
.ivu-layout {
  height: 100vh;
}
.ivu-dropdown {
  margin: 0px 20px;
}
</style>

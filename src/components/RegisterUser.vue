<template>
  <div class="regiter">
    <div class="regiterArea">
      <span class="loginTitle">
        <b>用户注册</b>
      </span>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="name">
          <Input type="text" v-model="formInline.name" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <br />
        <FormItem prop="password">
          <Input
            type="password"
            v-model="formInline.password"
            placeholder="Password"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <br />
        <FormItem prop="rePassword">
          <Input
            type="password"
            v-model="formInline.rePassword"
            placeholder="RePassword"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <br />

        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')"
            >Register</Button
          >
        </FormItem>
      </Form>
      <a @click="goLogin()" class="loginMessage">去登陆</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterUser",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return {
      tableData: [],
      formInline: {
        name: "",
        password: "",
        rePassword: "",
      },
      ruleInline: {
        name: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur",
          },
          {
            validator: (rule, value, cb) => {
              this.checkName(value, cb);
            },
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            message: "密码至少六位",
            trigger: "blur",
          },
        ],
        rePassword: [
          {
            // required: true,
            validator: (rule, value, cb) => {
              this.checkRePassword(value, cb);
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    //检查姓名是否有重复
    checkName(value, cb) {
      this.$axios
        .get("/checkName", {
          params: {
            name: value,
          },
        })
        .then((res) => {
          if (res.data == "1") {
            return cb(new Error("姓名不可用"));
          } else if (res.data == "0") {
            cb();
          }
        });
    },
    checkRePassword(value, cb) {
      console.log(value);
      if (value != this.formInline.password) {
        return cb(new Error("两次密码不一致"));
      }
      cb();
    },

    goLogin() {
      this.$router.push("/");
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/register", {
              name: this.formInline.name,
              password: this.formInline.password,
            })
            .then((res) => {
              console.log("返回值" + res.data);
              if (res.data == "Success") {
                this.$router.push("/");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          this.$Message.error("注册失败!");
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
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
  color: black;
}
.regiter {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.regiterArea {
  width: 30vw;
  height: 350px;
  background: #5cadff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 3%;
  margin-bottom: 50px;
}
.loginTitle {
  font-family: "PingFang SC";
  font-size: 30px;
  color: white;
  margin-bottom: 30px;
  margin-right: 100px;
}

.loginMessage {
  margin-left: 200px;
}
</style>

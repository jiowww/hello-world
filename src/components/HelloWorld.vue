<template>
  <div class="hello">
    <div class="loginArea">
      <span class="loginTitle">
        <b>用户登录</b>
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
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')"
            >Signin</Button
          >
        </FormItem>
      </Form>
      <a @click="goRegister()" class="loginMessage">没有账号，注册</a>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import jwt_decode from "jwt-decode";
export default {
  name: "HelloWorld",
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
      },
      ruleInline: {
        name: [
          {
            required: true,
            message: "Please fill in the user name",
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
      },
    };
  },
  methods: {
    ...mapMutations(["setToken"]),
    ...mapMutations(["setUserInfo"]),
    //跳转注册页面
    goRegister() {
      this.$router.push("/goRegister")
    },
    //登录
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$axios
            // .get("/login", {
            //   params: {
            //     name: this.formInline.name,
            //     password: this.formInline.password,
            //   },
            // })
            .post(
              "/login",
              {
                name: this.formInline.name,
                password: this.formInline.password,
              }
              // {headers:{'Content-Type':'application/x-www-form-urlencoded'}}
            )
            .then((res) => {
              if (res.data == "") {
                this.$Message.error("登录失败!");
              } else {
                // console.log("用户id：" + res.data.user.id);
                localStorage.setItem("userId", res.data.user.id);
                this.setToken({ token: res.data.token });
                console.log(jwt_decode(res.data.token));
                console.log("id:" + jwt_decode(res.data.token).userId);
                this.$router.push("/MyDemo");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          this.$Message.error("登录失败!");
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
  color: black;;
}
.hello {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.loginArea {
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

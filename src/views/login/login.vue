<template lang="html">
	<div class="login">
		<div class="animation">
			<div class="anima_top ani" :class="{up:login}"></div>
			<div class="anima_fot ani" :class="{down:login}"></div>
		</div>
		<div class="login_box" :class="{opa:login}">
			<div class="login_main">
				<div class="login_main_top">
					<img src="../../assets/imgs/login.png" alt="">
				</div>
          <div :key="1" class="login_form">
            <el-form :model='loginInfo' status-icon :rules='rules' ref='loginInfo' class="form">
              <el-form-item prop='name'>
                <el-input v-model='loginInfo.name' @change="success=false" placeholder='输入手机号'></el-input>
              </el-form-item>
              <el-form-item prop='password'>
                <el-input type="password" v-model='loginInfo.password' @change="success=false" placeholder='输入密码'></el-input>
              </el-form-item>
            </el-form>
            <button :disabled="disabled" @click='doLogin' type="button" class="login_btn">登录</button>
            <div class="login_more">
              <span class="forget" @click="$message('忘记密码，请与公司平台管理员联系')">忘记密码</span>
              <span class="register"><a style='color: #666' href="http://www.ewoodcloud.com" target="_blank">申请开户</a></span>
            </div>
          </div>
			</div>
		</div>
    <!-- 滑动验证 -->
    <el-dialog width="400px" append-to-body :visible.sync="visible">
      <div slot="title" class="verify_top">
         <span @click="$refs.verify.refresh()">
           <i class="iconfont shuaxin"></i>换一张
         </span>
      </div>
      <div v-if="visible">
        <slide-verify :w="340" :h="170" ref="verify" @success="onSuccess" @fail="onFail" @refresh="onRefresh" slider-text="向右滑动完成拼图"></slide-verify>
      </div>
    </el-dialog>
	</div>
</template>

<script>
	import setJson from '@/assets/json/setJson.json'
	console.log(setJson);
	export default {
		data() {
			let checkName = (rule, value, callback) => {
        if(!(/^1[3456789]\d{9}$/.test(value))){
          callback(new Error('请输入正确的手机号'));
        }else{
          callback();
        }
			};
			let checkPass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					callback();
				}
			}
			return {
				login: false,
				loginInfo: {
					name: '',
					password: '',
				},
				rules: {
					name: [{required:true,message:'请输入手机号',trigger:'blur'},{validator: checkName, trigger: 'blur'}],
					password: [{validator: checkPass, trigger: 'blur'}],
				},
				codeNum: null,
				img: null,
				codeShow: false,
				loading: false,
        disabled:false,
        visible:false,
        success:false,
        fade:1,
			}
		},
		methods: {
			doLogin() {
				this.$refs.loginInfo.validate((valid) => {
					if (valid) {
            this.visible = true;
					} else {
						return false
					}
				})
			},
			//获取用户id
			getId() {
		    const loading = this.$loading({lock: true, text: '登录中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios({
					method: 'post',
					headers: {
						'Authorization': 'Basic eW91bXU6eW91bXU=',
					},
					url: '/log/auth/mobile/token',
					params: {
			      mobile: this.loginInfo.name,
						password: this.loginInfo.password,
						grant_type: 'password',
						scope: 'server'
					},
				}).then(res => {
					loading.close();
					if (res.data && res.data.userId && res.status === 200) {
						this.getUserInfo(res.data.userId);
					} else {
						this.$message.error('登录错误！');
						this.disabled = false;
					}
				}, err => {
          this.disabled = false;
			    loading.close();
          if (err.response&&err.response.status === 400) {
						this.$message.error('用户名或密码错误！');
						this.loginInfo.name = '';
						this.loginInfo.password = '';
						this.success = false;
					}else{
            this.$message.error('登录失败！')
          }
				})
			},
			//获取用户信息
			getUserInfo(userId) {
		    const loading = this.$loading({lock: true, text: '获取用户信息中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios({
					method: 'get',
					url: '/log/admin/user/' + userId,
				}).then(res => {
					loading.close();
					if (res.data) {
						this.getUserPower(res.data)
					} else {
            this.disabled = false;
						this.$message.error('获取用户信息失败！');
					}
				},()=>{loading.close();this.$message.error('获取用户信息失败！');this.disabled = false;})
			},
			//获取用户权限
			getUserPower(userinfo) {
		    const loading = this.$loading({lock: true, text: '获取权限中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				this.$axios({
					method: 'get',
					url: '/api/erpCompany/showUserCompanyInfo',
					params: {
            userId:userinfo.id
          }
				}).then(res => {
			    loading.close();
					if (res && res.data.data) {
						this.$store.commit('login', JSON.stringify(userinfo));
						this.$store.commit('saveRole', JSON.stringify(res.data.data));
						this.getSetJson(userinfo);
					}else{
            this.disabled = false;
            this.$message.error('获取权限失败！')
          }
				},()=>{loading.close();this.$message.error('获取权限失败！');this.disabled = false;})
			},
			// 获取设置数据
			getSetJson(data){
				const loading = this.$loading({lock: true, text: '获取权限中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
				let params = {
					tenantId:data.tenantId,
					userId:data.id
				};
				this.$axios.get('/api/userSettingTable/showUserSetting',{params})
				.then(res=>{
					loading.close();
					if(res.data&&res.data.data&&res.data.data[0]&&res.data.data[0].settingText&&JSON.parse(res.data.data[0].settingText)){
						let obj = JSON.parse(res.data.data[0].settingText);
						let id = JSON.parse(res.data.data[0].id);
						let data = Object.assign({},setJson,obj);
						this.$store.commit('setSetJson',setJson);
						this.$store.commit('setId',id);
					}else{
						this.$store.commit('setSetJson',setJson)
					}
					setTimeout(() => {this.goTo();})
				},()=>{
					loading.close();
					this.store.commit('setSetJson',setJson);
					setTimeout(() => {this.goTo();})
				})
			},
			//跳转
			goTo() {
				this.login = true;
				setTimeout(() => {
					this.$router.push({
						name: 'homePage',
						params: {
							ani: 'login'
						}
					})
				})
			},
			//开户

      onSuccess(){
        this.disabled = true;
        this.visible = false;
        this.getId();
      },
      onFail(){

      },
      onRefresh(){

      },
		}
	}
</script>
<style>
	.login_form .el-input__inner {
		height: 35px;
		line-height: 35px;
	}

	.login_form .el-form-item__content {
		line-height: 35px;
	}

	.login_form .el-input__icon {
		line-height: 35px;
	}

	.login_form .el-loading-spinner .circular {
		width: 30px;
		height: 30px;
	}

	.login_form .el-loading-spinner {
		margin-top: -15px;
	}
  .login .el-dialog__body{
    padding:0 15px 15px !important;
  }
  .login .el-dialog__header{
    padding: 10px 15px;
  }
  .login .el-dialog__headerbtn{
    top: 10px;
  }
</style>
<style lang="scss" scoped>
  .find_form{
    height: 270px;
    background-color: #b176c6;
  }
  .open_form{
    height: 270px;
    background-color: red;
  }
  .verify_top{
    height: 25px;
    span{
      font-size: 14px;
      line-height: 25px;
      color: #666666;
      cursor: pointer;
      &:hover{
        color: #0d8ce2;
      }
      i{
        font-size: 24px;
        vertical-align: middle;
      }
    }
  }
  .success{
    height: 32px;
    border: 1px solid #0be2ca;
    background-color: #d0f6e0;
    color: #14d1ff;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
  }
	.login {
		height: 100%;
		margin-top: 0;
		position: absolute;
		z-index: 1000;
	}

	.animation {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		.ani {
			position: absolute;
			width: 200%;
			height: 100%;
		}

		.anima_top {
			background: #d9f380;
			top: -50%;
			left: -50%;
			transform: rotate(-5deg);
		}

		.anima_fot {
			background: #3e91e6;
			top: 50%;
			left: -50%;
			transform: rotate(-5deg);
		}

		.anima_top.up {
			top: -120%;
			animation: up 1s linear;
		}

		.anima_fot.down {
			top: 120%;
			animation: down 1s linear;
		}
	}

	.login_box {
		position: absolute;
		width: 360px;
		height: 420px;
		top: calc(50% - 250px);
		left: calc(50% - 180px);
		position: relative;

		.login_main {
			height: 420px;
			background: #ffffff;
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;

			.login_main_top {
				height: 150px;

				img {
					width: 360px;
					height: 150px;
				}
			}

			.login_form {
				padding: 30px 50px 0;
        height: 270px;
				.code {
					position: absolute;
					top: 0;
					right: -110px;
					width: 100px;
					height: 35px;
					border-radius: 3px;
					overflow: hidden;

					button {
						width: 100%;
						height: 100%;
						background: #ffffff;
						color: #00a0e9;
						border: 1px solid #00a0e9;
						border-radius: 3px;

						&:hover {
							color: #ffffff;
							background: #00a0e9;
						}
					}

					img {
						width: 100%;
						height: 100%;
					}

					.i {
						position: absolute;
						display: none;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background: rgba(0, 0, 0, 0.5);
						color: #ffffff;
						font-size: 20px;
						text-align: center;
						cursor: pointer;
					}

					&:hover {
						.i {
							display: block;
						}
					}
				}

				.form {
					height: 130px;
				}

				.login_btn {
					width: 100%;
					height: 40px;
					border: 0;
					background: #45a0e7;
					color: #ffffff;
					outline: none;

					&:hover {
						background: #80bff1;
					}
				}

				.login_more {
					margin-top: 10px;

					.register {
						float: right;
					}

					span {
						cursor: pointer;

						&:hover {
							color: #00a0e9;
						}
					}
				}
			}
		}

		.login_other {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 360px;
			top: 0;
		}
	}

	.login_box.opa {
		opacity: 0;
		transition: opacity 0.3s linear;
	}

  .fade-enter-active, .fade-leave-active {
    position: absolute;
    width: 100%;
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

	@keyframes up {
		0% {
			top: -50%;
		}

		50% {
			top: -50%;
		}

		100% {
			top: -120%;
		}
	}

	@keyframes down {
		0% {
			top: 50%
		}

		50% {
			top: 50%
		}

		100% {
			top: 120%
		}
	}

	@keyframes left {}
</style>

<template lang="html">
	<div class="listModule">
		<div class="list_header">
			<ym-hbt to='' @back='$emit("close")' title='账户权限'></ym-hbt>
		</div>
		<div class="list_setbar">
			<div class="list_setbar_options">
				<div class="option" @click='isTable = !isTable'>
					<div class="option_yuan"><i class="iconfont" :class="isTable?'jiugongge':'liebiao'"></i></div>
				</div>
				<div class="option" @click='refresh'>
					<div class="option_yuan"><i class="iconfont shuaxin"></i></div>
					<span class="option_txt">刷新</span>
				</div>
				<div class="option" @click='openAddUser'>
					<div class="option_yuan"><i class="iconfont xinjian"></i></div>
					<span class="option_txt">新建</span>
				</div>
        <div class="option" @click='openRole'>
          <div class="option_yuan"><i class="iconfont kehu"></i></div>
          <span class="option_txt">角色</span>
        </div>
				<div class="option" @click='setVisible=true'>
					<div class="option_yuan"><i class="iconfont cebian-shezhi"></i></div>
					<span class="option_txt">设置</span>
				</div>
				<div class="option" @click='openRole1'>
					<div class="option_yuan"><i class="iconfont icon-gongjushezhi1"></i></div>
					<span class="option_txt">角色</span>
				</div>
			</div>
		</div>
		<div class="list_main">
			<div class="list_main_table" v-if="isTable">
				<div class="table">
					<el-table :data='userList' height='100%' v-loadMethod='load' modname='.el-table__body-wrapper' loadmore='loadmore'>
						<el-table-column label='序号' type='index'></el-table-column>
						<el-table-column show-overflow-tooltip label='姓名' prop='userName'>
							<template slot-scope='scope'>
								<a href="javascript:void(0)" @click="openUserInfo(scope.row)">{{scope.row.userInfoTableVo&&scope.row.userInfoTableVo.realName?scope.row.userInfoTableVo.realName:scope.row.userName}}</a>
							</template>
						</el-table-column>
						<el-table-column v-if="tableShow.deptName" show-overflow-tooltip label='部门' prop='deptName'></el-table-column>
						<el-table-column v-if="tableShow.email" show-overflow-tooltip label='邮箱' prop='email'></el-table-column>
						<el-table-column v-if="tableShow.roleList" show-overflow-tooltip label='角色' prop='roleName'>
							<template slot-scope='scope'>{{scope.row.roleList|findRoler}}</template>
						</el-table-column>
						<el-table-column v-if="tableShow.mobile" show-overflow-tooltip label='手机' prop='mobile'></el-table-column>
					</el-table>
				</div>
				<div class="table_fot">
					<span>总数：{{total}}</span>
				</div>
			</div>
			<div class="list_main_card" v-if="!isTable">
				<div class="card" v-loadMethod='load' loadmore='loadmore'>
					<ul class="card_ul">
						<li class="card_li" v-for="(val,key) in userList" :key="key">
							<div class="card_li_con" style="padding-bottom: 60%">
								<div class="content" @click="openUserInfo(val)">
									<div class="content_left">
										<img :src="val.userInfoTableVo&&val.userInfoTableVo.avatar?val.userInfoTableVo.avatar:'avatar.png' | imgUrl" alt="">
									</div>
									<div class="content_right">
										<div class="content_right_row">
											<span class="v">{{val.userInfoTableVo&&val.userInfoTableVo.realName?val.userInfoTableVo.realName:""}}</span>
										</div>
                    <div class="content_right_row">
                      <span class="v">{{val.roleList|findRoler}}</span>
                    </div>
                    <div class="content_right_row">
                      <span class="v">{{val.deptName}}</span>
                    </div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="card_fot">
          <span>总数：{{total}}</span>
        </div>
			</div>
		</div>
		<!-- 新建公司员工 -->
    <el-dialog width="740px" title="添加用户" center :visible.sync="addUserVisible" v-dialogDrag>
      <div class="add_top">
        <ul class="add_top_ul">
          <li><span :class="{now:stap>=1}">1</span>员工信息</li>
          <li><span :class="{now:stap>=2}">2</span>账户信息</li>
        </ul>
      </div>
      <div class="add_main">
        <div class="add_main_" v-show="stap===1">
          <div class="user_form">
            <el-form size="mini" :model="addUserInfo" :rules="userRules" ref="userform" label-width="80px">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="addUserInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="addUserInfo.nickname"></el-input>
              </el-form-item>
              <el-form-item label="生日" prop="birthday">
                <el-date-picker v-model="addUserInfo.birthday" type="date"></el-date-picker>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="addUserInfo.address"></el-input>
              </el-form-item>
              <el-form-item label="部门" prop="dept">
                <el-select v-model="addUserInfo.dept" style="width:100%">
                  <el-option v-for="(val,key) in deptList" :key="key" :label="val.name" :value="val.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="addUserInfo.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="0">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div style="text-align: center;margin-top: 30px">
            <el-button type="primary" plain @click="addUserVisible=false">取消</el-button>
            <el-button type="primary" @click="submitUserForm">下一步</el-button>
          </div>
        </div>
        <div class="add_main_" v-show="stap===2">
          <div class="user_form">
            <el-form size="mini" :model="accountInfo" :rules="accountRules" ref="accountFrom" label-width="80px">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="accountInfo.userName"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="accountInfo.password"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="phone">
                <el-input v-model="accountInfo.phone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="accountInfo.email"></el-input>
              </el-form-item>
              <el-form-item label="角色" prop="roleId">
                <el-select style="width: 100%" v-model="accountInfo.roleId">
                  <el-option v-for="(val,key) in roleList" :key="key" :label="val.roleName" :value="val.roleId"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div style="text-align: center;margin-top: 30px">
            <el-button type="primary" plain @click="stapPro">上一步</el-button>
            <el-button type="primary" @click="submitAccountForm">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 设置弹窗 -->
    <el-dialog title='设置' center :visible.sync='setVisible' width='800px' v-dialogDrag>
      <div>
        <el-tabs v-model="activeOpt">
          <el-tab-pane label="表格字段" name="first">
            <options :data='tableOptions' @cb='updataTableOptions' @close='setVisible=false'></options>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
		<!-- 账户修改 -->
    <el-dialog width="750px" title="信息修改" center :visible.sync="modifyVisible"  v-dialogDrag>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="1">
          <div class="main">
            <div class="main_top">
              <div class="main_img">
                <img :src="userInfo.avatar|imgUrl" alt="">
                <i @click="openCropper">更换头像</i>
              </div>
              <div class="main_info">
                <el-form size="mini" :model="userInfo" ref="modifyForm" :rules="modifyRule" :inline="true" label-width="70px">
                  <el-form-item label="姓名" prop="realName">
                    <el-input style="width: 178px" v-model="userInfo.realName"></el-input>
                  </el-form-item>
                  <el-form-item label="昵称" prop="nickName">
                    <el-input style="width: 178px" v-model="userInfo.nickName"></el-input>
                  </el-form-item>
                  <el-form-item label="手机" prop="mobile">
                    <el-input style="width: 178px" v-model="userInfo.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input style="width: 178px" v-model="userInfo.email"></el-input>
                  </el-form-item>
                  <el-form-item label="地址" prop="location">
                    <el-input style="width: 178px" v-model="userInfo.location"></el-input>
                  </el-form-item>
                  <el-form-item label="生日" prop="birthdate">
                    <el-date-picker style="width: 178px" v-model="userInfo.birthdate" type="date"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="角色" prop="roleId">
                    <el-select style="width:178px" v-model="userInfo.roleId">
                      <el-option v-for="(val,key) in roleList" :key="key" :label="val.roleName" :value="val.roleId"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="部门" prop="deptId">
                    <el-select style="width:178px" v-model="userInfo.deptId">
                      <el-option v-for="(val,key) in deptList" :key="key" :label="val.name" :value="val.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="性别" prop="gender">
                    <el-radio-group style="width: 178px" v-model="userInfo.gender">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div style="margin-top: 30px;text-align: center">
              <el-button type="primary" plain @click="modifyVisible=false">取消</el-button>
              <el-button type="primary" @click="submitModify">确定</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="权限管理" name="2">
          <div class="main">
            <div class="main_top">
              <table>
                <tr>
                  <th>类型</th><th>查看</th><th>修改</th><th>新建</th><th>删除</th>
                </tr>
                <tr v-for="(val,key) in roleTemplate" :key="key">
                  <td>{{key}}</td>
                  <td v-for="(v,k) in val" :key="k"><el-checkbox v-if="v" @change="roleChange(val,k)" v-model="roleCheckboxList[v]"></el-checkbox></td>
                </tr>
              </table>
            </div>
            <div style="margin-top: 30px;text-align: center">
              <el-button type="primary" plain @click="modifyVisible">取消</el-button>
              <el-button type="primary" @click="modifyUserRole">确定</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="userInfo.id===userId" label="密码设置" name="3">
          <div class="main">
            <div class="main_top main_form">
              <el-form label-width="80px" ref="passForm" :model="passwordInfo" :rules="passwordRule">
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input type="password" v-model="passwordInfo.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword" required>
                  <el-input type="password" v-model="passwordInfo.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword" required>
                  <el-input type="password" v-model="passwordInfo.checkPassword"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div style="margin-top: 30px;text-align: center">
              <el-button type="primary" plain @click="modifyVisible=false">取消</el-button>
              <el-button type="primary" @click="submitPassword">确定</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 图片上传 -->
    <xcropper ref='cropper'></xcropper>
    <!-- 角色弹窗 -->
    <el-dialog width="750px" title="角色" center :visible.sync="roleVisible" v-dialogDrag>
      <div class="role">
        <div class="role_list" v-for="(val,key) in roleList" :key="key" @click="openRoleManagement(val.roleId)">
          <div class="role_list_img">
            <i class="iconfont" :class="val.roleCode"></i>
          </div>
          <span>{{val.roleName}}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 角色权限 -->
    <el-dialog width="700px" title="权限管理" center :visible.sync="roleManagementRole" v-dialogDrag>
      <div class="role_table">
        <table>
          <tr>
            <th>类型</th><th>查看</th><th>修改</th><th>新建</th><th>删除</th>
          </tr>
          <tr v-for="(val,key) in roleTemplate" :key="key">
            <td>{{key}}</td>
            <td v-for="(v,k) in val" :key="k"><el-checkbox v-if="v" @change="roleChange(val,k)" v-model="roleCheckboxList[v]"></el-checkbox></td>
          </tr>
        </table>
      </div>
      <div style="margin-top: 30px;text-align: center">
        <el-button type="primary" plain>取消</el-button>
        <el-button type="primary" @click="modifyRoleTemplate">确定</el-button>
      </div>
    </el-dialog>
		<!-- 新建角色 -->
		<el-dialog class='new' title='角色管理' center :visible.sync='newVisible' v-dialogDrag>
			<div class="dialog_tabs">
				<div class="dialog_tabs_item" :class="{active:tabs==1}" @click="tabs=1">角色添加</div>
				<div class="dialog_tabs_item" :class="{active:tabs==2}" @click="tabs=2">权限设置</div>
				<div class="dialog_tabs_item" :class="{active:tabs==3}" @click="tabs=3">添加权限</div>
			</div>
			<div class="dialog_tabs_main" v-show='tabs==1'>
				<div style="width: 400px;margin: 0 auto;">
					<el-form label-width='80px'>
						<el-form-item label='角色名'>
							<el-input v-model="role.name"></el-input>
						</el-form-item>
						<el-form-item label='角色code'>
							<el-input v-model="role.code"></el-input>
						</el-form-item>
						<el-form-item label='角色备注'>
							<el-input v-model="role.memo"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click='createRole'>立即创建</el-button>
							<el-button @click='newVisible=false'>取消</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="dialog_tabs_main" v-show='tabs==2' style="overflow: auto;">
				<el-select v-model="value1" placeholder="请选择角色" @change='getroleList(value1)'>
					<el-option v-for='(val,key) in jiaoselist' :key='key' :label="val.roleName" :value="val.roleId"></el-option>
				</el-select>
				<el-select v-model="value2" placeholder="选择模块">
					<el-option label="进销存" value="进销存"></el-option>
					<el-option label="财务" value="财务"></el-option>
					<el-option label="仓库" value="仓库"></el-option>
				</el-select>
				<table style="width: 100%;text-align: center;">
					<tr>
						<th>类型</th>
						<th>查看</th>
						<th>新建</th>
						<th>修改</th>
						<th>删除</th>
					</tr>
					<tr style='height: 40px;border-bottom:1px solid #ddd ;'>
						<td>{{value2}}</td>
						<td v-if='value2=="进销存"'>
							<el-checkbox v-model="checked['124']"></el-checkbox>
						</td>
						<td v-if='value2=="财务"'>
							<el-checkbox v-model="checked['125']"></el-checkbox>
						</td>
						<td v-if='value2=="仓库"'>
							<el-checkbox v-model="checked['126']"></el-checkbox>
						</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr v-for='(val,key) in data2' :key='key' style='height: 40px;border-bottom:1px solid #ddd ;'>
						<td>{{key}}</td>
						<td v-for='(v,k) in data2[key]' :key='k'>
							<el-checkbox v-if='v' v-model="checked[v]"></el-checkbox>
						</td>
					</tr>
				</table>
				<div style='margin-top:30px;text-align:center'>
					<el-button type='primary' plain @click='newVisible=false'>取消</el-button>
					<el-button type='primary' @click='fenQuan'>确定</el-button>
				</div>
			</div>
			<div class="dialog_tabs_main" v-show='tabs==3'>
				<div style="width: 400px;margin: 0 auto;">
					<el-form :data='form' label-width='80px'>
						<el-form-item label='权限名称' style='margin-button:20px'>
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label='权限标识' style='margin-button:20px'>
							<el-input v-model="form.permission"></el-input>
						</el-form-item>
						<el-form-item label='前端URL' style='margin-button:20px'>
							<el-input v-model="form.path"></el-input>
						</el-form-item>
						<el-form-item label='模块' style='margin-button:20px'>
							<el-radio-group v-model="form.moduleId">
								<el-radio label="2" style='margin-left: 15px;'>进销存</el-radio>
								<el-radio label="3" style='margin-left: 15px;'>财务</el-radio>
								<el-radio label="4" style='margin-left: 15px;'>仓库</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label='请求方式' style='margin-button:20px'>
							<el-radio-group v-model="form.method">
								<el-radio label="POST" style='margin-left: 15px;'>POST</el-radio>
								<el-radio label="GET" style='margin-left: 15px;'>GET</el-radio>
								<el-radio label="DELETE" style='margin-left: 15px;'>DELETE</el-radio>
								<el-radio label="PUT" style='margin-left: 15px;'>PUT</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label='菜单类型' style='margin-button:20px'>
							<el-radio-group v-model="form.type">
								<el-radio label="0" style='margin-left: 15px;'>菜单</el-radio>
								<el-radio label="1" style='margin-left: 15px;'>按钮</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label='权限描述' style='margin-button:20px'>
							<el-input v-model="form.memo"></el-input>
						</el-form-item>
						<el-form-item label='请求连接' style='margin-button:20px'>
							<el-input v-model="form.url"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click='addRole'>立即创建</el-button>
							<el-button >取消</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import headBackTitle from '@/components/headBackTitle.vue'
  import xcropper from '@/components/xcropper.vue'
  import options from '@/components/options.vue'
	export default {
		components: {
			"ym-hbt": headBackTitle,
      "xcropper":xcropper,
      "options":options,
		},
		data() {
      let validatePhone= (rule,value,callback)=>{
        if(!(/^1[3456789]\d{9}$/.test(value))){
          callback(new Error('请输入正确的手机号'));
        }else{
          callback();
        }
      };
      let validateEmail = (rule,value,callback)=>{
        if(!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value))){
          callback(new Error('请输入正确的电子邮箱'));
        }else{
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let validateAccount = (rule,value,callback) => {
      	if(!(/^[a-zA-Z0-9_-]{4,16}$/.test(value))){
          callback(new Error('由字母，数字，下划线组成'))
        }else{
      		callback();
        }
      }
			return {
          tabs: 1,
          form: {},
          role: {},
          checked: {},
          value1: '',
          value2: '',
          data1: {},
          data2: {},
          jiaoselist: [],
          jiaoRole: [],

				isTable: true,
        newVisible:false,
        tenantId: JSON.parse(this.$store.state.token).tenantId,
        userId: JSON.parse(this.$store.state.token).id,
        companyId:JSON.parse(this.$store.state.token).companyId,
        userList:[],
        total:0,
        pageNum:1,
        option:{},
        loadmore:false,
        addUserVisible:false,
        stap:null,
        addUserInfo:{
          name:'',
          nickname:'',
          birthday:'',
          address:'',
          dept:'',
          sex:'',
        },
        userRules:{
          name:[{required:true,message:'请输入姓名',trigger:'blur'},{min:2,max:5,message:'长度在2到5个字符',trigger:'blur'}],
          nickname:[{required:true,message:'请输入昵称',trigger:'blur'},{min:2,max:5,message:'长度在2到5个字符',trigger:'blur'}],
          birthday:[{type:'date',required:true,message:'请选择日期',trigger:'change'}],
          address:[{required:true,message:'请输入地址',trigger:'blur'}],
          dept:[{required:true,message:'请选择部门',trigger:'change'}],
          sex:[{required:true,message:'请选择性别',trigger:'change'}],
        },
        deptList:[],
        accountInfo:{
          userName:'',
          password:'',
          phone:'',
          email:'',
          roleId:'',
        },
        accountRules:{
          userName:[{required:true,message:'请输入用户名',trigger:'blur'},{validator:validateAccount,trigger:'blur'}],
          password:[{required:true,message:'请输入密码',trigger:'blur'},{min:6,max:9,message:'长度在6到9个字符',trigger:'blur'}],
          phone:[{required:true,message:'请输入手机号',trigger:'blur'},{validator:validatePhone,trigger:'blur'}],
          email:[{required:true,message:'请输入电子邮箱',trigger:'blur'},{validator:validateEmail,trigger:'blur'}],
          roleId:[{required:true,message:'请选择角色',trigger:'change'}]
        },
        roleList: [],
        activeName:'1',
        modifyVisible:false,
        userInfo:{
          realName:'',
          nickName:'',
          mobile:'',
          email:'',
          location:'',
          birthdate:'',
          roleId:'',
          deptId:'',
          gender:''
        },
        modifyRule:{
          realName:[{required:true,message:'请输入姓名',trigger:'blur'},{min:2,max:5,message:'长度在2到5个字符',trigger:'blur'}],
          nickName:[{required:true,message:'请输入昵称',trigger:'blur'},{min:2,max:5,message:'长度在2到5个字符',trigger:'blur'}],
          birthdate:[{required:true,message:'请选择日期',trigger:'blur'}],
          location:[{required:true,message:'请输入地址',trigger:'blur'}],
          deptId:[{required:true,message:'请选择部门',trigger:'change'}],
          gender:[{required:true,message:'请选择性别',trigger:'change'}],
          mobile:[{required:true,message:'请输入手机号',trigger:'blur'},{validator:validatePhone,trigger:'blur'}],
          email:[{required:true,message:'请输入电子邮箱',trigger:'blur'},{validator:validateEmail,trigger:'blur'}],
          roleId:[{required:true,message:'请选择角色',trigger:'change'}]
        },
        passwordInfo:{
          oldPassword:'',
          newPassword:'',
          checkPassword:'',
        },
        passwordRule:{
          oldPassword:[{required:true,message:'请输入活动名称',trigger:'blur'},{min:6,max:9,message:'长度在6到9个字符',trigger:'blur'}],
          newPassword:[{validator:validatePass,trigger:'blur'}],
          checkPassword:[{validator:validatePass2,trigger:'blur'}],
        },
        activeOpt:'first',
        setVisible:false,
        roleVisible:false,
        roleManagementRole:false,
        roleCheckboxList:{},

        roleTemplate:{
            "进销存":[124,null,null,null],
            "产品管理":[115,117,116,118],
            "客户":[119,120,121,122],
            "供应商":[123,128,127,129],
            "开证公司":[130,132,131,133],
            "清关公司": [134,136,135,137],
            "清关路线": [198,200,199,201],
            "销售单": [138,140,139,141],
            "销售部门": [142,144,143,145],
            "采购单": [146,148,147,149],
            "进货单": [150,152,151,153],
            "清关单": [154,156,155,157],
            "在途货物": [158,null,null,null],
            "库存锁定": [159,161,160,162],
            "进销存报表": [163,null,null,null],
            "财务": [125,null,null,null],
            "资金账户":[181,183,182,184],
            "收支记账": [185,187,186,188],
            "收付款":[204,205,206,207],
            "借入借出": [189,191,190,192],
            "转账": [193,195,194,196],
            "财务流水":[203,null,null,null],
            "财务报表": [197,null,null,null],
            "仓库":[126,null,null,null],
            "调拨单": [164,166,165,167],
            "盘点": [168,170,169,171],
            "入库单": [172,174,173,175],
            "出库单": [176,178,177,179],
            "仓库管理":[208,209,210,211],
            "仓库报表": [180,null,null,null]
        }
			}
		},
    computed:{
      tableShow:function() {
        let temp = {};
        this.tableOptions.forEach((val)=>{
          temp[val.key]=val.show
        });
        return temp;
      },
			tableOptions:function(){
				return JSON.parse(this.$store.state.setJson).tableOptions.AR;
			}
    },
		methods: {
      // 获取员工信息
      getData(pageNum,pageSize,options,callback){
        let params = {
          pageNum:pageNum,
          pageSize:pageSize,
          companyId:JSON.parse(sessionStorage.getItem('youmuUser')).companyId
        };
        this.$axios.get('/api/erpCompany/showUserInfoPage',{params})
        .then(res=>{
          if(res.data&&res.data.data){
            this.userList = this.userList.concat(res.data.data.dataList);
            this.total = res.data.data.total;
          }
          callback?callback(res.data.data):null
        },()=>{
          callback?callback(false):null
        })
      },
      // 无限加载
      load(callback){
        this.getData(this.pageNum++,30,this.option,(data)=>{
          callback();
          this.loadmore = data.pages>data.pageNo
        })
      },
      // 刷新
      refresh(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        //重新请求数据
        this.userList = [];
        this.pageNum = 1;
        this.option = {};
        this.getData(this.pageNum++,30,{},(data)=>{
          loading.close();
          this.loadmore = data.pages>data.pageNo;
          if(data){
            this.$message.success('刷新完成')
          }else{
            this.$message.error('刷新失败')
          }
        })
      },
      // 新建
      openAddUser(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {
          tenantId:this.tenantId
        };
        this.$axios.get('/api/storeTable/shwoDeptList',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.addUserVisible = true;
            this.stap = 1;
            this.deptList = res.data.data;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 员工信息表单验证
      submitUserForm(){
        this.$refs.userform.validate((valid) => {
          if (valid) {
            this.stapNext();
          } else {
            this.$message.error('请完善信息')
          }
        });
      },
      // 下一个
      stapNext(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/api/erpCompany/showRoleInfo',{params})
        .then(res=>{
           loading.close();
           if(res.data&&res.data.data){
             let data = res.data.data;
             let list = [];
             for(let i in data){
               if(data[i].roleCode.indexOf('ERP_')!==-1){
                 list.push(data[i])
               }
             }
             this.roleList = list;
             this.accountInfo = {
               userName:'',
               password:'',
               phone:'',
               email:'',
               roleId:'',
             };
             this.stap = 2;
           }else{
             this.$message.error('获取数据失败')
           }
        },()=>{loading.close();this.$message.error('获取数据失败')});
      },
      // 上一个
      stapPro(){
        this.stap = 1;
      },
      // 账户信息表单验证
      submitAccountForm(){
        this.$refs.accountFrom.validate((valid) => {
          if (valid) {
            this.addUser();
          } else {
            this.$message.error('请完善信息')
          }
        });
      },
      // 添加员工数据
      addUser(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let info = JSON.parse(this.$store.state.token);
        let data = {
            companyId:info.companyId,
            companyName:info.companyName,
            email:this.accountInfo.email,
            isValid:1,
            loginCount:0,
            mobile:this.accountInfo.phone,
            password:this.accountInfo.password,
            tenantId:this.tenantId,
            userName:this.accountInfo.userName,
            deptId:this.addUserInfo.dept,
            roleId:this.accountInfo.roleId,
            userInfoTableVo:{
              birthdate:this.addUserInfo.birthday,
              gender:this.addUserInfo.sex,
              isValid:1,
              location:this.addUserInfo.address,
              nickName:this.addUserInfo.nickname,
              realName:this.addUserInfo.name
            }
        };
        this.$axios.post('/api/erpCompany/addUserTableInfo',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.addUserVisible = false;
          }else{
            this.$message.error('添加员工失败')
          }
        },()=>{loading.close();this.$message.error('添加员工失败')})
      },
      // 打开员工信息
      openUserInfo(data){
        this.activeName = '1';
        this.modifyVisible = true;
        setTimeout(()=>{
          this.getUserInfo(data);
          this.getDepartmentList();
          this.getRoleList();
        })
      },
      handleClick(){
        if(this.activeName === '1'){
          this.getUserInfo(this.userInfo);
          this.getDepartmentList();
          this.getRoleList();
        }
        if(this.activeName === '2') this.getUserRole();
      },
      // 获取员工信息
      getUserInfo(data){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {userId:data.id};
        this.$axios.get('/api/erpCompany/showUserCompanyInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.userInfo = Object.assign(res.data.data,res.data.data.userInfoTableVo);
            this.userInfo.roleOldId = 0;
            this.userInfo.roleId = null;
            this.userInfo.deptOldId = this.userInfo.deptId;
            let data = res.data.data.roleCompanyVoList;
            for(let i in data){
              if(data[i].roleCode.indexOf('ERP_')!== -1){
                this.userInfo.roleId = data[i].roleId;
                this.userInfo.roleOldId = data[i].roleId;
              }
            }
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 获取部门信息
      getDepartmentList(){
        let params = {tenantId:this.tenantId};
        this.$axios.get('/api/storeTable/shwoDeptList',{params})
        .then(res=>{
          if(res.data&&res.data.data){
            this.deptList = res.data.data;
          }else{
            this.$message.error('获取部门列表失败')
          }
        })
      },
      // 获取权限角色列表
      getRoleList(){
        let params = {tenantId:this.tenantId};
        this.$axios.get('/api/erpCompany/showRoleInfo',{params})
        .then(res=>{
          if(res.data&&res.data.data){
            let data = res.data.data;
            let arr = [];
            for(let i in data){
              if(data[i].roleCode.indexOf('ERP_')!==-1){
                arr.push(data[i])
              }
            }
            this.roleList = arr;
          }else{
            this.$message.error('获取权限列表失败')
          }
        })
      },
      // 打开上传图片
      openCropper(){
        let option = {
          title:'员工头像',
          msg:'建议图片大小：2M'
        };
        this.$refs.cropper.open(option,(data)=>{
          this.userInfo.avatar = data
        });
      },
      // 修改信息表单验证
      submitModify(){
        this.$refs.modifyForm.validate((valid) => {
          if (valid) {
            this.modifyUserInfo();
            this.changeRoleId();
            this.changeDeptId();
          } else {
            this.$message.error('请完善信息')
          }
        });
      },
      // 修改信息
      modifyUserInfo(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = {
          email:this.userInfo.email,
          id:this.userInfo.id,
          mobile:this.userInfo.mobile,
          tenantId:this.tenantId,
          userInfoTableVo:{
            avatar:this.userInfo.avatar,
            birthdate:this.userInfo.birthdate,
            gender:this.userInfo.gender,
            location:this.userInfo.location,
            realName:this.userInfo.realName,
            nickName:this.userInfo.nickName,
            userId:this.userInfo.id
          }
        };
        this.$axios.post('/api/erpCompany/modifyUserTableInfo',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.modifyVisible = false;
            this.refresh();
          }else{
            this.$message.error('修改信息失败')
          }
        },()=>{loading.close();this.$message.error('修改信息失败')})
      },
      // 修改角色id
      changeRoleId(){
        let params = {
          userId:this.userInfo.id,
          oldRoleId:this.userInfo.roleOldId,
          roleId:this.userInfo.roleId,
          companyId:this.userInfo.companyId
        };
        this.$axios.get('/api/erpCompany/modifyUserRoleCompany',{params})
        .then(res=>{
          if(res.data&&res.data.data){
            if(this.userId===this.userInfo.id){
              this.updataRole();
            }
          }
        })
      },
      // 修改部门id
      changeDeptId(){
        if(this.userInfo.deptOldId){
          let data = {
            companyId: this.userInfo.companyId,
            deptId: this.userInfo.deptId,
            userId: this.userInfo.id
          };
          let params = {
            deptId: this.userInfo.deptOldId,
          };
          this.$axios({
            method: 'post',
            url: '/api/erpCompany/modifyCompanyStaffErp',
            data:data,
            params:params
          })
        }else{
          let data = {
            companyId: this.userInfo.companyId,
            deptId: this.userInfo.deptId,
            userId: this.userInfo.id,
          };
          this.$axios.post('/api/erpCompany/addCompanyStaffErp',data)
        }
      },
      // 获取个人权限
      getUserRole(){
        let data = this.userInfo.menuList;
        this.roleHandle(data);
      },
      // 修改个人权限
      modifyUserRole(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let arr = this.roleCheckboxList;
        let data = [];
        for(let i in arr){
          if(arr[i]){
            data.push({
              companyId:this.companyId,
              menuId:i,
              roleId:this.userInfo.roleId,
              userId:this.userInfo.id
            })
          }
        }
        let params = {
          roleId:this.userInfo.roleId,
          companyId:this.companyId,
          userId:this.userInfo.id
        };
        this.$axios({
          url:'/api/erpCompany/addUserRoleCompanyListErp',
          method:'post',
          data:data,
          params:params
        }).then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.modifyVisible = false;
            this.$message.success('修改成功');
            if(this.userInfo.id===this.userId){
              this.updataRole();
            }
          }else{
            this.$message.error('修改权限失败')
          }
        },()=>{loading.close();this.$message.error('修改权限失败')})
      },
      // 验证设置密码表单
      submitPassword(){
        this.$refs.passForm.validate((valid)=>{
          if(valid){
            this.modifyPassword();
          }else{
            this.$message.error('请完善信息')
          }
        })
      },
      // 修改密码
      modifyPassword(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let data = {
          id:this.userInfo.id,
          password:this.password.newPassword,
          tenantId:this.tenantId,
        };
        this.$axios.post('/api/erpCompany/modifyUserTableInfo',data)
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.modifyVisible = false;
          }else{
            this.$message.error('修改密码失败')
          }
        },()=>{loading.close();this.$message.error('修改密码失败')})
      },
      // 更新表格字段
      updataTableOptions(data){
        let setJson = JSON.parse(this.$store.state.setJson);
        setJson.tableOptions.AR = data;
        this.$store.commit('setSetJson', setJson);
        this.upSetJson(setJson);
      },
			// 上传设置数据
			upSetJson(val) {
				let data = {
					settingText: JSON.stringify(val),
					tenantId: this.tenantId,
					userId: this.userId
				}
				this.$axios.post('/api/userSettingTable/modifyUserSettingTable', data)
			},
      // 打开角色窗口
      openRole(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let params = {tenantId:this.tenantId};
        this.$axios.get('/api/erpCompany/showRoleInfo',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.roleVisible = true;
            let data = res.data.data;
            let arr = [];
            for(let i in data){
              if(data[i].roleCode.indexOf('ERP_')!==-1){
                arr.push(data[i])
              }
            }
            this.roleList = arr;
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 打开角色权限窗口
      openRoleManagement(id){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        this.roleId = id;
        let params = {id :id,companyId:this.companyId};
        this.$axios.get('/api/erpCompany/findMenuByRoleIdCompanyIddErp',{params})
        .then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            this.roleManagementRole = true;
            this.roleHandle(res.data.data);
          }else{
            this.$message.error('获取数据失败')
          }
        },()=>{loading.close();this.$message.error('获取数据失败')})
      },
      // 权限处理
      roleHandle(data){
        let roleCheckboxList = {};
        for(let i in data){
          roleCheckboxList[data[i].id] = true;
        }
        this.roleCheckboxList = roleCheckboxList;
      },
      // 权限选择
      roleChange(data,num){
        if(this.roleCheckboxList[data[num]]){
          // 选中
          if([115,117,116,118,119,120,121,122,123,128,127,129,130,132,131,133,134,136,135,137,198,200,199,201,138,140,139,141,142,144,143,145,146,148,147,149,150,152,151,153,154,156,155,157,158,159,161,160,162,163].indexOf(data[num])!==-1){
            this.$set(this.roleCheckboxList,124,true);
          }
          if([181,183,182,184,185,187,186,188,189,191,190,192,193,195,194,196,197,204,205,206,207].indexOf(data[num])!==-1){
              this.$set(this.roleCheckboxList,125,true);
          }
          if([164,166,165,167,168,170,169,171,172,174,173,175,176,178,177,179,180,208,209,210,211].indexOf(data[num])!==-1){
              this.$set(this.roleCheckboxList,126,true);
          }
          if(num>0){
            this.$set(this.roleCheckboxList,data[0],true);
          }
        }else{
          // 选否
          if(data[num]===124){
            let arr = [115,117,116,118,119,120,121,122,123,128,127,129,130,132,131,133,134,136,135,137,198,200,199,201,138,140,139,141,142,144,143,145,146,148,147,149,150,152,151,153,154,156,155,157,158,159,161,160,162,163];
            for(let i in arr){
              this.$set(this.roleCheckboxList,arr[i],false);
            }
          }
          if(data[num]===125){
            let arr = [185,187,186,188,189,191,190,192,193,195,194,196,197,181,183,182,184,204,205,206,207];
            for(let i in arr){
              this.$set(this.roleCheckboxList,arr[i],false);
            }
          }
          if(data[num]===126){
            let arr = [164,166,165,167,168,170,169,171,172,174,173,175,176,178,177,179,180,208,209,210,211];
            for(let i in arr){
              this.$set(this.roleCheckboxList,arr[i],false);
            }
          }
          if(num === 0){
            for(let i in data){
              if(data[i]){
                this.$set(this.roleCheckboxList,data[i],false);
              }
            }
          }
        }
      },
      // 修改权限模板
      modifyRoleTemplate(){
        const loading = this.$loading({lock: true, text: '数据加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let arr = this.roleCheckboxList;
        let data = [];
        for(let i in arr){
          if(arr[i]){
            data.push({
              companyId:this.companyId,
              menuId:i,
              roleId:this.roleId
            })
          }
        }
        let params = {roleId:this.roleId,companyId:this.companyId};
        this.$axios({
          url:'/api/erpCompany/addRoleMenuCompanyListErp',
          method:'post',
          data:data,
          params:params
        }).then(res=>{
          loading.close();
          if(res.data&&res.data.data){
            let arr = JSON.parse(this.$store.state.token).roleList
            for(let i in arr){
              if(this.roleId === arr[i].roleId){
                this.updataRole();
              }
            }
          }else{
            this.$message.error('修改角色权限失败')
          }
        },()=>{loading.close();this.$message.error('修改角色权限失败')})
      },
      // 更新权限
      updataRole(){
        this.$store.commit('loginout');
        this.$store.commit('removeRole');
        this.$router.push({name:'login'})
      },

			//新建角色
			openRole1() {
				this.newVisible = true;
				this.$axios({
					method: 'get',
					url: '../../static/roleList.json',
				}).then(res => {
					this.data1 = res.data;
				})
				//获取角色
				this.$axios({
					method: 'get',
					url: '/api/erpCompany/showRoleInfo',
					params: {
						tenantId: this.comInfo.tenantId,
					}
				}).then(res => {
					if (res && res.data.data) {
						let data = res.data.data;
						let arr = [];
						for (let i in data) {
							if (data[i].roleCode.indexOf('ERP') != -1) {
								arr.push(data[i])
							}
						}
						this.jiaoselist = arr;
					}
				})
			},
			createRole() {
				this.$axios({
					method: 'post',
					url: '/api/erpCompany/addRoleTableErp',
					data: {
						roleCode: this.role.code,
						roleMemo: this.role.memo,
						roleName: this.role.name,
						createTime: new Date(),
						updateTime: new Date(),
						icon: '11',
					}
				}).then(res => {
					if (res && res.data.data) {
						this.$message('添加角色成功：' + this.role.name);
						this.role = {};
					}
				})
			},
			addRole() {
				this.$axios({
					method: 'post',
					url: '/api/erpCompany/addMenuTableListErp',
					data: [{
						method: this.form.method,
						moduleId: this.form.moduleId,
						name: this.form.name,
						path: this.form.path,
						permission: this.form.permission,
						type: this.form.type,
						uri: this.form.url,
						memo: this.form.memo,
					}]
				}).then(res => {
					if (res && res.data.data) {
						this.$message('添加成功')
						this.form.name = '';
						this.form.permission = '';
					}
				})
			},
			//分配权限
			fenQuan() {
				this.newVisible = false;
				let data = this.checked;
				let checkRoleId = [];
				let metaRoleId = [];
				for (let i in data) {
					if (data[i]) {
						checkRoleId.push(i - 0);
					}
				}
				for (let i in this.jiaoRole) {
					metaRoleId.push(this.jiaoRole[i].id)
				}

				if (metaRoleId.length == 0) {
					this.addRoleMeun(checkRoleId);
				} else {
					for (let i = 0; i < checkRoleId.length; i++) {
						for (let n = 0; n < metaRoleId.length; n++) {
							if (checkRoleId[i] == metaRoleId[n]) {
								checkRoleId.splice(i, 1);
								metaRoleId.splice(n, 1);
								i--;
								break;
							}
						}
					}
					this.addRoleMeun(checkRoleId);
					this.removeRoleMeun(metaRoleId);
				}
			},
			//获取角色权限
			getroleList(data) {
				this.jiaoRole = [];
				this.$axios({
					method: 'get',
					url: '/api/erpCompany/findMenuByRoleIdErp',
					params: {
						id: data
					}
				}).then(res => {
					if (res && res.data.data) {
						this.jiaoRole = res.data.data;
						this.showRole();
					}
				})
			},
			//角色新增权限
			addRoleMeun(data) {
				if (data.length == 0) return;
				let arr = []
				for (let i in data) {
					let obj = {
						menuId: data[i],
						roleId: this.value1
					}
					arr.push(obj);
				}
				this.$axios({
					method: 'post',
					url: '/api/erpCompany/addRoleMenuTableListErp',
					data: arr,
				}).then(res => {
					if (res && res.data.data) {
						this.$message('添加成功')
					}
				})
			},
			//角色删除权限
			removeRoleMeun(data) {
				if (data.length == 0) return;
				let arr = [];
				for (let i in data) {
					let obj = {
						menuId: data[i],
						roleId: this.value1
					}
					arr.push(obj)
				}
				this.$axios({
					method: 'post',
					url: '/api/erpCompany/deleteRoleMenuTableList',
					data: arr,
				}).then(res => {
					if (res && res.data.data) {
						this.$message('删除成功')
					}
				})
			},
			//渲染权限
			showRole() {
				this.data2 = this.data1[this.value2];
				for (let i in this.checked) {
					this.$set(this.checked, i, false)
				}
				for (let i in this.jiaoRole) {
					this.$set(this.checked, this.jiaoRole[i].id, true)
				}
			}
		},
		watch: {
			value2: {
				handler() {
					this.showRole();
				},
				deep: true,
			},
			checked: {
				handler() {
				},
				deep: true,
			},
      roleCheckboxList:{
        handler() {
        },
        deep: true,
      }
		},
		filters: {
			findRoler: function(data) {
				if (data.length > 0) {
					for (let i in data) {
						if (data[i].roleCode&&data[i].roleCode.indexOf('ERP') !== -1) {
							return data[i].roleName;
						}
					}
				} else {
					return;
				}
			}
		}
	}
</script>

<style>
	.midefy .el-dialog {
		width: 750px;
	}

	.addPre .el-dialog {
		width: 740px;
	}

	.new .el-dialog {
		width: 800px;
	}

	.el-input__icon {
		line-height: 25px;
	}

	.el-radio {
		margin-left: 20px;
	}

	.stap_main .stap_form_item .el-input__prefix{
		display: none;
	}

	.stap_main .stap_form_item .el-input__suffix{
		display: none;
	}
  .user_form .el-input__inner{
    padding-left: 15px !important;
  }
  .main_info .el-input__inner{
    padding-left: 15px !important;
  }
</style>
<style lang="scss" scoped>
  .role_table,.main_top{
    height: 400px;
    overflow: auto;
    table{
      width: 100%;
      tr{
        height: 35px;
        text-align: center;
        border-bottom: 1px solid #e5e5e5;
      }
    }
  }
  .role{
    height: 320px;
    overflow: auto;
    .role_list{
      float: left;
      width: 100px;
      height: 130px;
      margin: 15px 34px;
      border-radius: 5px;
      text-align: center;
      cursor: pointer;
      .role_list_img{
        width: 100px;
        height: 100px;
        i{
          font-size: 70px;
        }
      }
      span{
        line-height: 30px;
      }
    }
  }
  .add_top{
    height: 70px;
    border-bottom: 1px solid #e5e5e5;
    .add_top_ul{
      padding-top: 20px;
      text-align: center;
      li{
        display: inline-block;
        margin: 0 20px;
        span{
          display: inline-block;
          background: rgb(217, 217, 217);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          color: #ffffff;
          margin-right: 10px;
        }
        span.now{
          background: rgb(106, 158, 85);
        }
      }
    }
  }
  .add_main{
    padding-top: 20px;
    .user_form{
      width: 300px;
      height: 300px;
      margin: 0 auto;
    }
  }
  .main{
    height: 400px;
    .main_top{
      height: 330px;
      position: relative;
      .main_img{
        position: absolute;
        width: 90px;
        height: 90px;
        border: 1px solid #e5e5e5;
        border-radius: 50%;
        overflow: hidden;
        top:50px;
        left: 40px;
        &:hover{
          i{
            display: block;
          }
        }
        img{
          width: 100%;
          height: 100%;
        }
        i{
          line-height: 90px;
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background-color: rgba(0,0,0,0.4);
          color: #ffffff;
          cursor:pointer;
          display: none;
        }
      }
      .main_info{
        margin-left: 170px;
        height: 100%;
        padding-top: 50px;
      }
    }
    .main_top.main_form{
      width: 350px;
      margin: 0 auto;
      padding-top: 80px;
    }
  }
	.listModule {
		height: 100%;
    .card_li_con{
      .content_left{
        float: left;
        height: 100%;
        width: 90px;
        background-color: #ffffff;
        img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: block;
          margin: 30px auto 0;
        }
      }
      .content_right{
        float: left;
        height: 100%;
        width: calc(100% - 90px);
        background-color: #f9f9fb;
        .content_right_row{
          font-size: 14px;
          color: #666666;
          padding-left: 10px;
          padding-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 10px;
        }
        .content_right_row:first-child{
          margin-top: 20px;
          margin-bottom: 20px;
        }
      }
    }
	}
</style>

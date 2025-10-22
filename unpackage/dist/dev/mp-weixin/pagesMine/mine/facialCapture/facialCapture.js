(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pagesMine/mine/facialCapture/facialCapture"],{

/***/ 578:
/*!******************************************************************************************************************************!*\
  !*** /Users/a8833/Documents/GitHub/jxj_miniprograms-dev/main.js?{"page":"pagesMine%2Fmine%2FfacialCapture%2FfacialCapture"} ***!
  \******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _facialCapture = _interopRequireDefault(__webpack_require__(/*! ./pagesMine/mine/facialCapture/facialCapture.vue */ 579));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_facialCapture.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 579:
/*!*********************************************************************************************************!*\
  !*** /Users/a8833/Documents/GitHub/jxj_miniprograms-dev/pagesMine/mine/facialCapture/facialCapture.vue ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _facialCapture_vue_vue_type_template_id_207a1be2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./facialCapture.vue?vue&type=template&id=207a1be2&scoped=true& */ 580);
/* harmony import */ var _facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./facialCapture.vue?vue&type=script&lang=js& */ 582);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _facialCapture_vue_vue_type_style_index_0_id_207a1be2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./facialCapture.vue?vue&type=style&index=0&id=207a1be2&scoped=true&lang=scss& */ 584);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 33);

var renderjs





/* normalize component */

var component = Object(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _facialCapture_vue_vue_type_template_id_207a1be2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _facialCapture_vue_vue_type_template_id_207a1be2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "207a1be2",
  null,
  false,
  _facialCapture_vue_vue_type_template_id_207a1be2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pagesMine/mine/facialCapture/facialCapture.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 580:
/*!****************************************************************************************************************************************************!*\
  !*** /Users/a8833/Documents/GitHub/jxj_miniprograms-dev/pagesMine/mine/facialCapture/facialCapture.vue?vue&type=template&id=207a1be2&scoped=true& ***!
  \****************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_template_id_207a1be2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./facialCapture.vue?vue&type=template&id=207a1be2&scoped=true& */ 581);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_template_id_207a1be2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_template_id_207a1be2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_template_id_207a1be2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_template_id_207a1be2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 581:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/a8833/Documents/GitHub/jxj_miniprograms-dev/pagesMine/mine/facialCapture/facialCapture.vue?vue&type=template&id=207a1be2&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var m0 = _vm.state == 0 ? _vm.$t("mine.mine.facialCapture.confirmAs") : null
  var m1 =
    _vm.state == 0 ? _vm.$t("mine.mine.facialCapture.captureFacial") : null
  var m2 = _vm.state == 0 ? _vm.$t("mine.mine.facialCapture.tipState") : null
  var m3 =
    _vm.state == 1 ? _vm.$t("mine.mine.facialCapture.tipCapturing") : null
  var m4 =
    _vm.state == 2 ? _vm.$t("mine.mine.facialCapture.confirmPhoto") : null
  var m5 =
    _vm.state == 4 ? _vm.$t("mine.mine.facialCapture.uploadSuccess") : null
  var m6 =
    _vm.state == 5 ? _vm.$t("mine.mine.facialCapture.uploadSuccess") : null
  var g0 = [2, 4, 5, 6].includes(_vm.state)
  var g1 = [0, 1, 2, 3, 4].includes(_vm.state)
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        m0: m0,
        m1: m1,
        m2: m2,
        m3: m3,
        m4: m4,
        m5: m5,
        m6: m6,
        g0: g0,
        g1: g1,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 582:
/*!**********************************************************************************************************************************!*\
  !*** /Users/a8833/Documents/GitHub/jxj_miniprograms-dev/pagesMine/mine/facialCapture/facialCapture.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./facialCapture.vue?vue&type=script&lang=js& */ 583);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 583:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/a8833/Documents/GitHub/jxj_miniprograms-dev/pagesMine/mine/facialCapture/facialCapture.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, wx) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _request = __webpack_require__(/*! ../../../common/request.js */ 75);
var _url = __webpack_require__(/*! ../../../common/url.js */ 76);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  data: function data() {
    return {
      isiOSSystem: false,
      selectedStudent: {},
      studentList: [],
      schoolInfo: {},
      tmpSrc: '../../static/images/facial_user.png',
      baiduToken: '',
      errorTips: '',
      facialTips: '',
      state: 0,
      completeStudent: []
    };
  },
  computed: {
    leftButtonTitle: function leftButtonTitle() {
      switch (this.state) {
        case 2:
          // 重拍
          return this.$t('mine.mine.facialCapture.againPhoto');
        case 4:
          // 完成
          return this.$t('mine.mine.facialCapture.complete');
        case 5:
          // 完成
          return this.$t('mine.mine.facialCapture.complete');
        case 6:
          // 重新录入
          return this.$t('mine.mine.facialCapture.againCapture');
        default:
          return "";
      }
    },
    rightButtonTitle: function rightButtonTitle() {
      switch (this.state) {
        case 0:
          // 开始录入
          return this.$t('mine.mine.facialCapture.begainCapture');
        case 1:
          // 拍照
          return this.$t('mine.mine.facialCapture.takePhoto');
        case 2:
          // 确认
          return this.$t('common.enter');
        case 3:
          // 重新录入
          return this.$t('mine.mine.facialCapture.againCapture');
        case 4:
          // 下一个
          return this.$t('mine.mine.facialCapture.nextUpload');
        default:
          return '';
      }
    }
  },
  onLoad: function onLoad() {
    uni.setNavigationBarTitle({
      title: this.$t('mine.mine.facialCapture.title')
    });
    this.isiOSSystem = uni.getSystemInfoSync().osName === 'ios';
    var _this = this;
    var eventChannel = _this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromClassManagePage', function (data) {
      _this.selectedStudent = data.item;
      _this.studentList = data.studentList;
      _this.schoolInfo = data.school;
      if (!data.item.faceUrl) {
        return;
      }
      _this.state = 6;
      _this.tmpSrc = data.school.faceDomain + '/file' + data.item.faceUrl;
      if (data.item.modelStatus == 2) {
        _this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
      } else if (data.item.modelStatus == 1) {
        _this.facialTips = _this.$t('mine.mine.facialCapture.facialModeling');
      } else if (data.item.modelStatus == 0) {
        _this.facialTips = _this.$t('mine.mine.facialCapture.uploadComplete');
      }
    });
    this.queryBaiduToken();
  },
  methods: {
    // 获取百度云token
    queryBaiduToken: function queryBaiduToken() {
      var params = {
        'grant_type': 'client_credentials',
        'client_id': '7aO67qYEKqhHIrHRbqLvcFVi',
        'client_secret': 'FexWTfbGyjqUFeIRwc9fnjto3CSyAN0m'
      };
      var _this = this;
      uni.request({
        url: 'https://aip.baidubce.com/oauth/2.0/token',
        method: 'GET',
        data: params,
        success: function success(res) {
          _this.baiduToken = res.data.access_token || '';
        },
        fail: function fail() {
          _this.baiduToken = null;
        }
      });
    },
    // 用户不允许使用摄像头时触发
    cameraAuthError: function cameraAuthError(err) {
      uni.showToast({
        icon: 'none',
        title: err.message
      });
    },
    // 点击左边按钮
    tapLeftButton: function tapLeftButton() {
      if (this.state == 2) {
        // 重拍
        this.state = 1;
      } else if (this.state == 4) {
        // 确定
        uni.navigateBack();
      } else if (this.state == 5) {
        // 确定
        uni.navigateBack();
      } else if (this.state == 6) {
        // 重新录入
        this.state = 1;
      }
    },
    // 点击右边按钮
    tapRightButton: function tapRightButton() {
      if (this.state == 0) {
        // 开始录入
        this.state = 1;
      } else if (this.state == 1) {
        // 拍照
        this.takePhoto();
      } else if (this.state == 2) {
        // 确认
        this.handlePhoto();
      } else if (this.state == 3) {
        // 重新录入
        this.errorTips = null;
        this.facialTips = null;
        this.state = 1;
      } else if (this.state == 4) {
        // 下一个
        this.errorTips = null;
        this.facialTips = null;
        this.state = 1;
      }
    },
    // 截取图片
    takePhoto: function takePhoto() {
      var _this2 = this;
      var context = uni.createCameraContext();
      context.takePhoto({
        quality: 'high',
        success: function success(res) {
          _this2.tmpSrc = res.tempImagePath;
          _this2.state = 2;
        },
        fail: function fail() {
          _this2.errorTips = _this2.$t('mine.mine.facialCapture.captureFailState');
          _this2.facialTips = _this2.$t('mine.mine.facialCapture.tipState');
          _this2.state = 3;
        }
      });
    },
    // 处理图片
    handlePhoto: function handlePhoto() {
      var _this3 = this;
      uni.showLoading();
      this.getImageSize(this.tmpSrc).then(function (size) {
        if (size >= 100 * 1024 && size <= 300 * 1024) {
          _this3.readImage(_this3.tmpSrc);
        } else {
          _this3.redrawImage(_this3.tmpSrc);
        }
      }).catch(function () {
        _this3.readImage(_this3.tmpSrc);
      });
    },
    // 重绘图片
    redrawImage: function redrawImage(imageSrc) {
      var _this4 = this;
      wx.createSelectorQuery().select('#canvasId') // 在 WXML 中填入的 id
      .fields({
        node: true,
        size: true
      }).exec(function (res) {
        // Canvas 对象
        var canvas = res[0].node;

        // 渲染上下文
        var ctx = canvas.getContext('2d');

        // Canvas 画布的实际绘制宽高
        var width = res[0].width;
        var height = res[0].height;

        // 初始化画布大小
        var dpr = wx.getWindowInfo().pixelRatio;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // 图片对象
        var image = canvas.createImage();
        // 图片加载完成回调
        image.onload = function () {
          // 将图片绘制到 canvas 上
          ctx.drawImage(image, 0, 0, 640, 640);

          // 生成图片
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 640,
            height: 640,
            destWidth: 640,
            destHeight: 640,
            canvas: canvas,
            fileType: 'jpg',
            quality: 0.5,
            success: function success(tempRes) {
              _this4.readImage(tempRes.tempFilePath);
            },
            fail: function fail() {
              _this4.errorTips = _this4.$t('mine.mine.facialCapture.captureFailState');
              _this4.facialTips = null;
              _this4.state = 3;
              uni.hideLoading();
            }
          });
        };
        // 设置图片src
        image.src = imageSrc;
      });
    },
    // 读取图片为发送检测人脸
    readImage: function readImage(imageSrc) {
      var _this5 = this;
      var fileManager = uni.getFileSystemManager();
      fileManager.readFile({
        encoding: 'base64',
        filePath: imageSrc,
        success: function success(res) {
          _this5.sendImageDetection(res.data);
        },
        fail: function fail() {
          _this5.errorTips = _this5.$t('mine.mine.facialCapture.captureFailState');
          _this5.facialTips = null;
          _this5.state = 3;
          uni.hideLoading();
        }
      });
    },
    // 发送图片到百度云人脸检测
    sendImageDetection: function sendImageDetection(image) {
      if (!this.baiduToken) {
        return;
      }
      var params = {
        'image': image,
        'image_type': 'BASE64',
        'face_field': 'quality,eye_status,mask,spoofing',
        'max_face_num': 10
      };
      var _this = this;
      uni.request({
        url: "https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=".concat(_this.baiduToken),
        method: 'POST',
        data: params,
        success: function success(res) {
          if (res.data.error_code == 0) {
            var tips = _this.handleFacialInfo(res.data.result);
            if (tips !== '') {
              _this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
              _this.facialTips = tips;
              _this.state = 3;
              uni.hideLoading();
            } else {
              _this.uploadImage(image);
            }
          } else {
            _this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
            _this.facialTips = null;
            _this.state = 3;
            uni.hideLoading();
          }
        },
        fail: function fail() {
          _this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
          _this.facialTips = null;
          _this.state = 3;
          uni.hideLoading();
        }
      });
    },
    // 处理百度人脸检测返回信息
    handleFacialInfo: function handleFacialInfo(info) {
      if (info.face_num > 1) {
        // 检测到的图片中的人脸数量
        return '请单独录入';
      }
      var face = info.face_list[0];
      if (face.face_probability < 0.8) {
        // 人脸置信度，范围【0~1】
        return '请录入人脸';
      }
      if (face.angle.yaw > 15 || face.angle.yaw < -15) {
        // 左右转脸，左右旋转角[-90(左), 90(右)]
        return '请不要左右转动';
      }
      if (face.angle.pitch > 20 || face.angle.pitch < -20) {
        // 抬头低头，俯仰角度[-90(上), 90(下)]
        return '请不要低头或抬头';
      }
      if (face.mask.type == 1 && face.mask.probability > 0.5) {
        // 带口罩，0代表没戴口罩 1 代表戴口罩，置信度，范围0~1
        return '请不要带口罩';
      }
      if (face.eye_status.left_eye < 0.3 || face.eye_status.right_eye < 0.3) {
        // 左右眼闭合，[0,1]取值，越接近0闭合的可能性越大
        return '请不要闭眼';
      }
      if (face.quality.blur > 0.7) {
        // 人脸模糊程度，范围[0~1]，0表示清晰，1表示模糊
        return '请保持稳定，不要抖动';
      }
      if (face.quality.completeness != 1) {
        // 人脸完整度，0或1, 0为人脸溢出图像边界，1为人脸都在图像边界内
        return '请保持人脸在框内';
      }
      var occlusion = face.quality.occlusion;
      if (occlusion.left_eye > 0.3) {
        // 左眼遮挡比例，[0-1] ，1表示完全遮挡
        return '请不要遮挡眼睛';
      }
      if (occlusion.right_eye > 0.3) {
        // 右眼遮挡比例，[0-1] ， 1表示完全遮挡
        return '请不要遮挡眼睛';
      }
      if (occlusion.nose > 0.3) {
        // 鼻子遮挡比例，[0-1] ， 1表示完全遮挡
        return '请不要遮挡鼻子';
      }
      if (occlusion.mouth > 0.3) {
        // 嘴巴遮挡比例，[0-1] ， 1表示完全遮挡
        return '请不要遮挡嘴巴';
      }
      if (occlusion.left_cheek > 0.3) {
        // 左脸颊遮挡比例，[0-1] ， 1表示完全遮挡
        return '请不要遮挡脸颊';
      }
      if (occlusion.right_cheek > 0.3) {
        // 右脸颊遮挡比例，[0-1] ， 1表示完全遮挡
        return '请不要遮挡脸颊';
      }
      if (occlusion.chin > 0.3) {
        // 下巴遮挡比例，，[0-1] ， 1表示完全遮挡
        return '请不要遮挡下巴';
      }
      return '';
    },
    // 上传图片
    uploadImage: function uploadImage(fileData) {
      var _this = this;
      var formData = {
        'baseFile': fileData,
        'uploadSource': '4' // 1.一体机；2.APP；3.管理后台；4.小程序
      };

      var headers = {
        studentId: _this.selectedStudent.studentId
      };
      (0, _request.postReq)(_url.URL.apiPostFaceUpload, formData, headers).then(function (result) {
        if (result.error == 10000) {
          var params = Object.assign({}, result.data, {
            studentId: _this.selectedStudent.studentId || ''
          });
          (0, _request.postReq)(_url.URL.apiPostFaceBinding, params, headers).then(function (res) {
            if (res.error == 10000) {
              _this.handleUploadCompleted();
            } else {
              _this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
              _this.facialTips = null;
              _this.state = 3;
            }
          });
        } else {
          _this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
          _this.facialTips = null;
          _this.state = 3;
        }
      }).catch(function (err) {
        _this.errorTips = _this.$t('mine.mine.facialCapture.captureFailState');
        _this.facialTips = null;
        _this.state = 3;
      }).finally(function () {
        uni.hideLoading();
      });
    },
    //	处理上传完成状态
    handleUploadCompleted: function handleUploadCompleted() {
      var _this6 = this;
      this.facialTips = this.$t('mine.mine.facialCapture.statusState');
      this.completeStudent.push(this.selectedStudent.studentId);
      var nextStudent = this.studentList.find(function (item) {
        var isEmpty = item.modelStatus == null || item.modelStatus == 0 && !item.faceUrl;
        var isCompleted = _this6.completeStudent.includes(item.studentId);
        return !isCompleted && (isEmpty || item.modelStatus == 2);
      });
      if (nextStudent) {
        this.selectedStudent = nextStudent;
        this.state = 4;
      } else {
        this.state = 5;
      }
    },
    // 图片尺寸
    getImageSize: function getImageSize(imageSrc) {
      return new Promise(function (resolve, reject) {
        var fileManager = uni.getFileSystemManager();
        fileManager.getFileInfo({
          filePath: imageSrc,
          success: function success(fileInfo) {
            resolve(fileInfo.size);
          },
          fail: function fail() {
            reject(false);
          }
        });
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),

/***/ 584:
/*!*******************************************************************************************************************************************************************!*\
  !*** /Users/a8833/Documents/GitHub/jxj_miniprograms-dev/pagesMine/mine/facialCapture/facialCapture.vue?vue&type=style&index=0&id=207a1be2&scoped=true&lang=scss& ***!
  \*******************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_style_index_0_id_207a1be2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./facialCapture.vue?vue&type=style&index=0&id=207a1be2&scoped=true&lang=scss& */ 585);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_style_index_0_id_207a1be2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_style_index_0_id_207a1be2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_style_index_0_id_207a1be2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_style_index_0_id_207a1be2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_facialCapture_vue_vue_type_style_index_0_id_207a1be2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 585:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/a8833/Documents/GitHub/jxj_miniprograms-dev/pagesMine/mine/facialCapture/facialCapture.vue?vue&type=style&index=0&id=207a1be2&scoped=true&lang=scss& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[578,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pagesMine/mine/facialCapture/facialCapture.js.map
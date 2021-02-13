"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = void 0;
var axios_1 = require("axios");
var unloadedState = {
    rolesPrivileges: [],
    privileges: [],
    responseAdd: false,
    reponseAddRemove: false,
    loading: false,
    accessRight: [],
    isDownload: false,
    unAuthorizedPage: false,
    updateResponse: false,
};
exports.actionCreators = {
    getRoles: function () { return function (dispatch) {
        (function fetch() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_ROLE_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("api/roles")];
                        case 1:
                            response = _c.sent();
                            if (response)
                                dispatch({ type: "GET_ROLES", payload: response.data });
                            else
                                dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _c.sent();
                            dispatch({ type: "SET_ROLE_LOADING", payload: false });
                            if (((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.status) === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_ROLE_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: error_1.response.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    getPrivileges: function () { return function (dispatch) {
        (function fetch() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_ROLE_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("api/roles/privileges")];
                        case 1:
                            response = _c.sent();
                            if (response)
                                dispatch({ type: "GET_PRIVILEGES", payload: response.data });
                            else
                                dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _c.sent();
                            dispatch({ type: "SET_ROLE_LOADING", payload: false });
                            if (((_b = (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.status) === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_ROLE_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: error_2.response.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    addRemoveRolePrivileges: function (value) { return function (dispatch) {
        (function post() {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_3;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_ROLE_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.put("api/roles", value)];
                        case 1:
                            response = _d.sent();
                            if (response)
                                dispatch({ type: "ADD_ROLE_PRIVILEGES", payload: response === null || response === void 0 ? void 0 : response.data });
                            else
                                dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _d.sent();
                            dispatch({ type: "SET_ROLE_LOADING", payload: false });
                            if (((_b = (_a = error_3.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.status) === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_ROLE_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: (_c = error_3 === null || error_3 === void 0 ? void 0 : error_3.response) === null || _c === void 0 ? void 0 : _c.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    addRolePrivilege: function (value) { return function (dispatch) {
        (function post() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_4;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_ROLE_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.post("api/roles/privileges", value)];
                        case 1:
                            response = _c.sent();
                            if (response)
                                dispatch({ type: "ADD_ROLE_PRIVILEGE", payload: response.data });
                            else
                                dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _c.sent();
                            dispatch({ type: "SET_ROLE_LOADING", payload: false });
                            if (((_b = (_a = error_4.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.status) === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_ROLE_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: error_4.response.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    updateRolePrivilege: function (value) { return function (dispatch) {
        (function put() {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_5;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_ROLE_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.put("api/roles/privileges", value)];
                        case 1:
                            response = _d.sent();
                            if (response)
                                dispatch({ type: "ADD_ROLE_PRIVILEGE", payload: response.data });
                            else
                                dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _d.sent();
                            dispatch({ type: "SET_ROLE_LOADING", payload: false });
                            if (((_b = (_a = error_5.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.status) === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_ROLE_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: (_c = error_5 === null || error_5 === void 0 ? void 0 : error_5.response) === null || _c === void 0 ? void 0 : _c.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    deleteRolePrivlege: function (value) { return function (dispatch) {
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_6;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        dispatch({ type: "SET_ROLE_LOADING", payload: true });
                        return [4 /*yield*/, axios_1.default.delete("api/roles/privileges", { params: __assign({}, value) })];
                    case 1:
                        response = _d.sent();
                        if (response)
                            dispatch({ type: "ADD_ROLE_PRIVILEGE", payload: response.data });
                        else
                            dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _d.sent();
                        dispatch({ type: "SET_ROLE_LOADING", payload: false });
                        if (((_b = (_a = error_6.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.status) === "403") {
                            dispatch({
                                payload: true,
                                type: "SET_ROLE_PAGE",
                            });
                        }
                        dispatch({ type: "GET_ERRORS", payload: (_c = error_6 === null || error_6 === void 0 ? void 0 : error_6.response) === null || _c === void 0 ? void 0 : _c.data });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    }; },
    getAccessRights: function () { return function (dispatch) {
        (function fetch() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_7;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_ROLE_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("api/roles/accessrights")];
                        case 1:
                            response = _c.sent();
                            if (response)
                                dispatch({ type: "GET_ACCESS_RIGHT", payload: response.data });
                            else
                                dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _c.sent();
                            dispatch({ type: "SET_ROLE_LOADING", payload: false });
                            if (((_b = (_a = error_7.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.status) === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_ROLE_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: error_7.response.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    updateAccessRights: function (value) { return function (dispatch) {
        (function put() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_8;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_ROLE_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.put("api/roles/accessrights", value)];
                        case 1:
                            response = _c.sent();
                            if (response)
                                dispatch({ type: "SET_UPDATED", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _c.sent();
                            dispatch({ type: "SET_ROLE_LOADING", payload: false });
                            if (((_b = (_a = error_8.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.status) === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_ROLE_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: error_8.response.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    export: function () { return function (dispatch) {
        (function get() {
            return __awaiter(this, void 0, void 0, function () {
                var response, url, link, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_DOWNLOAD", payload: true });
                            return [4 /*yield*/, axios_1.default.get("", { responseType: "blob" })];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                url = window.URL.createObjectURL(new Blob([response.data]));
                                link = document.createElement("a");
                                link.href = url;
                                link.setAttribute("download", "AccessRight.xls");
                                document.body.appendChild(link);
                                link.click();
                                dispatch({ type: "SET_DOWNLOAD", payload: false });
                            }
                            dispatch({ type: "SET_DOWNLOAD", payload: false });
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            dispatch({ type: "SET_DOWNLOAD", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: error_9.response.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
};
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedState;
    }
    var action = incomingAction;
    switch (action.type) {
        case "GET_ROLES":
            return __assign(__assign({}, state), { loading: false, rolesPrivileges: action.payload });
        case "GET_PRIVILEGES":
            return __assign(__assign({}, state), { loading: false, privileges: action.payload });
        case "ADD_ROLE_PRIVILEGE":
            return __assign(__assign({}, state), { loading: false, responseAdd: action.payload });
        case "ADD_ROLE_PRIVILEGES":
            return __assign(__assign({}, state), { loading: false, reponseAddRemove: action.payload });
        case "SET_ROLE_LOADING":
            return __assign(__assign({}, state), { loading: action.payload });
        case "GET_ACCESS_RIGHT":
            return __assign(__assign({}, state), { loading: false, accessRight: action.payload });
        case "SET_ROLE_PAGE":
            return __assign(__assign({}, state), { unAuthorizedPage: action.payload });
        case "SET_UPDATED":
            return __assign(__assign({}, state), { loading: false, updateResponse: action.payload });
        case "SET_DOWNLOAD":
            return __assign(__assign({}, state), { isDownload: action.payload });
        default:
            return state;
    }
};
//# sourceMappingURL=RoleStore.js.map
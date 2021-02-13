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
    users: {},
    user: {},
    loading: false,
    response: false,
    updateResponse: {},
    ldap: {},
    isConnected: false,
    isDownload: false,
    adUsers: {},
    isAdded: {},
};
exports.actionCreators = {
    getUsers: function () { return function (dispatch) {
        var empty = [];
        dispatch({ type: "CLEAR_USERS", payload: empty });
        axios_1.default
            .get("api/users")
            .then(function (response) { return dispatch({ type: "GET_USERS", payload: response.data }); })
            .catch(function (error) {
            var _a;
            dispatch({ type: "USER_LOADING", payload: false });
            dispatch({ type: "GET_ERRORS", payload: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data });
        });
    }; },
    export: function () { return function (dispatch) {
        (function get() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var response, url, link, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_DOWNLOAD", payload: true });
                            return [4 /*yield*/, axios_1.default.get("/api/users/export", {
                                    responseType: "blob",
                                })];
                        case 1:
                            response = _b.sent();
                            if (response) {
                                url = window.URL.createObjectURL(new Blob([response.data]));
                                link = document.createElement("a");
                                link.href = url;
                                link.setAttribute("download", "Users.xls");
                                document.body.appendChild(link);
                                link.click();
                                dispatch({ type: "SET_DOWNLOAD", payload: false });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _b.sent();
                            dispatch({ type: "SET_DOWNLOAD", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    getPaginatedUsers: function (value) { return function (dispatch) {
        axios_1.default
            .get("api/users/paging", { params: __assign({}, value) })
            .then(function (response) { return dispatch({ type: "GET_USERS", payload: response.data }); })
            .catch(function (error) { var _a; return dispatch({ type: "GET_ERRORS", payload: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data }); });
    }; },
    getUser: function (id) { return function (dispatch) {
        dispatch({ type: "USER_LOADING", payload: true });
        axios_1.default
            .get("api/users/" + id)
            .then(function (response) { return dispatch({ type: "GET_USER", payload: response.data }); })
            .catch(function (error) {
            var _a;
            dispatch({ type: "USER_LOADING", payload: false });
            dispatch({ type: "GET_ERRORS", payload: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data });
        });
    }; },
    postApproved: function (user) { return function (dispatch) {
        (function post() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            dispatch({ type: "USER_LOADING", payload: true });
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, axios_1.default.post("api/users/approved", user)];
                        case 2:
                            response = _c.sent();
                            if (response)
                                dispatch({ type: "SET_RESPONSE", payload: (_a = response.data) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _c.sent();
                            dispatch({ type: "USER_LOADING", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_b = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _b === void 0 ? void 0 : _b.data });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    postEdit: function (user) { return function (dispatch) {
        (function post() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            dispatch({ type: "USER_LOADING", payload: true });
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, axios_1.default.post("api/users/edit", user)];
                        case 2:
                            response = _b.sent();
                            if (response)
                                dispatch({ type: "SET_UPDATE_RESPONSE", payload: response.data });
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _b.sent();
                            dispatch({ type: "USER_LOADING", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_3 === null || error_3 === void 0 ? void 0 : error_3.response) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    getLdap: function () { return function (dispatch) {
        (function get() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            dispatch({ type: "USER_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("api/users/ldap")];
                        case 1:
                            response = _b.sent();
                            if (response)
                                dispatch({ type: "GET_LDAP", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _b.sent();
                            dispatch({ type: "USER_LOADING", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    testConnection: function (testDetails) { return function (dispatch) {
        (function post() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            dispatch({ type: "USER_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.post("api/users/testconnection", testDetails)];
                        case 1:
                            response = _b.sent();
                            if (response)
                                dispatch({ type: "TEST_CONNECTION", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _b.sent();
                            dispatch({ type: "USER_LOADING", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_5 === null || error_5 === void 0 ? void 0 : error_5.response) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    loadADUser: function (searchDetails) { return function (dispatch) {
        (function get() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            dispatch({ type: "USER_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("/api/users/ldap/search", {
                                    params: __assign({}, searchDetails),
                                })];
                        case 1:
                            response = _b.sent();
                            if (response)
                                dispatch({ type: "GET_LDAP_USERS", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _b.sent();
                            dispatch({ type: "USER_LOADING", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_6.response) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    searchUsers: function (userFilter) { return function (dispatch) {
        (function get() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            dispatch({ type: "USER_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("/api/users/search", {
                                    params: __assign({}, userFilter),
                                })];
                        case 1:
                            response = _b.sent();
                            if (response)
                                dispatch({ type: "GET_USERS", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _b.sent();
                            dispatch({ type: "USER_LOADING", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_7.response) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    exportSearch: function (userFilter) { return function (dispatch) {
        (function get() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var response, url, link, error_8;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_DOWNLOAD", payload: true });
                            return [4 /*yield*/, axios_1.default.get("/api/users/search/export", {
                                    params: __assign({}, userFilter),
                                    responseType: "blob",
                                })];
                        case 1:
                            response = _b.sent();
                            if (response) {
                                url = window.URL.createObjectURL(new Blob([response.data]));
                                link = document.createElement("a");
                                link.href = url;
                                link.setAttribute("download", "Users.xls");
                                document.body.appendChild(link);
                                link.click();
                                dispatch({ type: "SET_DOWNLOAD", payload: false });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _b.sent();
                            dispatch({ type: "SET_DOWNLOAD", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_8.response) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    searchPaginateUsers: function (userFilter) { return function (dispatch) {
        (function get() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_9;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            dispatch({ type: "USER_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("/api/users/paging/search", {
                                    params: __assign({}, userFilter),
                                })];
                        case 1:
                            response = _b.sent();
                            if (response)
                                dispatch({ type: "GET_USERS", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _b.sent();
                            dispatch({ type: "USER_LOADING", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_9.response) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    saveLdap: function (ldap) { return function (dispatch) {
        (function post() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var error_10;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, axios_1.default.post("/api/users/ldap", ldap)];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_10 = _b.sent();
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_10.response) === null || _a === void 0 ? void 0 : _a.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    addAdUser: function (users) { return function (dispatch) {
        (function post() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var response, error_11;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            dispatch({ type: "USER_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.post("/api/users", users)];
                        case 1:
                            response = _b.sent();
                            if (response)
                                dispatch({ type: "SET_IS_ADDED", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_11 = _b.sent();
                            dispatch({ type: "USER_LOADING", payload: false });
                            dispatch({ type: "GET_ERRORS", payload: (_a = error_11.response) === null || _a === void 0 ? void 0 : _a.data });
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
        case "GET_USERS":
            return __assign(__assign({}, state), { loading: false, users: action.payload });
        case "CLEAR_USERS":
            return __assign(__assign({}, state), { loading: false, users: action.payload });
        case "GET_LDAP_USERS":
            return __assign(__assign({}, state), { loading: false, adUsers: action.payload });
        case "SET_IS_ADDED":
            return __assign(__assign({}, state), { loading: false, isAdded: action.payload });
        case "GET_USER":
            return __assign(__assign({}, state), { loading: false, user: action.payload });
        case "SET_RESPONSE":
            return __assign(__assign({}, state), { loading: false, response: action.payload });
        case "CLEAR_RESPONSE":
            return __assign(__assign({}, state), { response: false });
        case "SET_UPDATE_RESPONSE":
            return __assign(__assign({}, state), { loading: false, updateResponse: action.payload });
        case "CLEAR_UPDATE_RESPONSE":
            return __assign(__assign({}, state), { updateResponse: {} });
        case "USER_LOADING":
            return __assign(__assign({}, state), { loading: action.payload });
        case "GET_LDAP":
            return __assign(__assign({}, state), { loading: false, ldap: action.payload });
        case "TEST_CONNECTION":
            return __assign(__assign({}, state), { loading: false, isConnected: action.payload.data });
        case "SET_DOWNLOAD":
            return __assign(__assign({}, state), { isDownload: action.payload });
        default:
            return state;
    }
};
//# sourceMappingURL=UsersStore.js.map
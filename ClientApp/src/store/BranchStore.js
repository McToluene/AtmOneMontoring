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
    branches: {},
    isBranchLoading: false,
    isCreated: {},
    branch: {},
    unAuthorizedPage: false,
    isDownload: false,
};
exports.actionCreators = {
    getBranches: function () { return function (dispatch) {
        (function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("api/branch")];
                        case 1:
                            response = _a.sent();
                            if (response)
                                dispatch({ type: "GET_BRANCHES", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
                            if (error_1.response.headers.status === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            if (error_1.response.headers.status === "401") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
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
    getPaginatedBranches: function (filter) { return function (dispatch) {
        (function get() {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("api/branch/paging", {
                                    params: __assign({}, filter),
                                })];
                        case 1:
                            response = _a.sent();
                            if (response)
                                dispatch({ type: "GET_BRANCHES", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
                            if (error_2.response.headers.status === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            if (error_2.response.headers.status === "401") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
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
    searchPaginatedBranches: function (filter) { return function (dispatch) {
        (function get() {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("api/branch/paging/search", {
                                    params: __assign({}, filter),
                                })];
                        case 1:
                            response = _a.sent();
                            if (response)
                                dispatch({ type: "GET_BRANCHES", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
                            if (error_3.response.headers.status === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            if (error_3.response.headers.status === "401") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: error_3.response.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    searchBranches: function (filter) { return function (dispatch) {
        (function get() {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("api/branch/search", {
                                    params: __assign({}, filter),
                                })];
                        case 1:
                            response = _a.sent();
                            if (response)
                                dispatch({ type: "GET_BRANCHES", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
                            if (error_4.response.headers.status === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            if (error_4.response.headers.status === "401") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
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
    addBranch: function (branch) { return function (dispatch) {
        (function post() {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.post("api/branch", branch)];
                        case 1:
                            response = _a.sent();
                            if (response)
                                dispatch({ type: "SET_IS_CREATED", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
                            if (error_5.response.headers.status === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            if (error_5.response.headers.status === "401") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: error_5.response.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    addBranches: function (branch) { return function (dispatch) {
        (function post() {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.post("api/branch/list", branch)];
                        case 1:
                            response = _a.sent();
                            if (response)
                                dispatch({ type: "SET_IS_CREATED", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
                            if (error_6.response.headers.status === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            if (error_6.response.headers.status === "401") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            dispatch({ type: "GET_ERRORS", payload: error_6.response.data });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        })();
    }; },
    getBranch: function (id) { return function (dispatch) {
        (function get() {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
                            return [4 /*yield*/, axios_1.default.get("api/branch/detail", {
                                    params: { id: id },
                                })];
                        case 1:
                            response = _a.sent();
                            if (response)
                                dispatch({ type: "GET_BRANCH", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
                            if (error_7.response.headers.status === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            if (error_7.response.headers.status === "401") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
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
    updateBranch: function (terminal) { return function (dispatch) {
        (function put() {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ payload: true, type: "SET_BRANCHES_LOADING" });
                            return [4 /*yield*/, axios_1.default.put("api/branch", terminal)];
                        case 1:
                            response = _a.sent();
                            if (response)
                                dispatch({ type: "SET_IS_CREATED", payload: response.data });
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            dispatch({ payload: false, type: "SET_BRANCHES_LOADING" });
                            if (error_8.response.headers.status === "403") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
                                });
                            }
                            if (error_8.response.headers.status === "401") {
                                dispatch({
                                    payload: true,
                                    type: "SET_BRANCH_PAGE",
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
    export: function (branchFilter) { return function (dispatch) {
        (function get() {
            return __awaiter(this, void 0, void 0, function () {
                var response, url, link, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            dispatch({ type: "SET_BRANCH_DOWNLOAD", payload: true });
                            return [4 /*yield*/, axios_1.default.get("/api/branch/export", {
                                    params: __assign({}, branchFilter),
                                    responseType: "blob",
                                })];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                url = window.URL.createObjectURL(new Blob([response.data]));
                                link = document.createElement("a");
                                link.href = url;
                                link.setAttribute("download", "Branches.xls");
                                document.body.appendChild(link);
                                link.click();
                                dispatch({ type: "SET_BRANCH_DOWNLOAD", payload: false });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            dispatch({ type: "SET_BRANCH_DOWNLOAD", payload: false });
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
    if (state === undefined)
        return unloadedState;
    var action = incomingAction;
    switch (action.type) {
        case "GET_BRANCHES":
            return __assign(__assign({}, state), { isBranchLoading: false, branches: action.payload });
        case "SET_BRANCHES_LOADING":
            return __assign(__assign({}, state), { isBranchLoading: action.payload });
        case "SET_IS_CREATED":
            return __assign(__assign({}, state), { isBranchLoading: false, isCreated: action.payload });
        case "GET_BRANCH":
            return __assign(__assign({}, state), { isBranchLoading: false, branch: action.payload });
        case "SET_BRANCH_PAGE":
            return __assign(__assign({}, state), { isBranchLoading: false, unAuthorizedPage: action.payload });
        case "SET_BRANCH_DOWNLOAD":
            return __assign(__assign({}, state), { isDownload: action.payload });
        default:
            return state;
    }
};
//# sourceMappingURL=BranchStore.js.map
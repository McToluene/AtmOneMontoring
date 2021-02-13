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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = void 0;
var axios_1 = require("axios");
var unloadedState = {
    camera: {},
    loading: false,
};
exports.actionCreators = {
    fetchCamera: function () { return function (dispatch) {
        dispatch({ payload: true, type: "SET_CAMERA_LOADING" });
        axios_1.default
            .get("/api/issues/cameras")
            .then(function (response) {
            return dispatch({
                type: "SET_CAMERA_DETAILS",
                payload: response === null || response === void 0 ? void 0 : response.data,
            });
        })
            .catch(function (error) {
            var _a;
            dispatch({ payload: false, type: "SET_CAMERA_LOADING" });
            dispatch({ payload: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data, type: "GET_ERRORS" });
        });
    }; },
};
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedState;
    }
    var action = incomingAction;
    switch (action.type) {
        case "SET_CAMERA_DETAILS":
            return __assign(__assign({}, state), { loading: false, camera: action.payload });
        case "SET_CAMERA_LOADING":
            return __assign(__assign({}, state), { loading: action.payload });
        default:
            return state;
    }
};
//# sourceMappingURL=CameraStore.js.map
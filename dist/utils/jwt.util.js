"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const default_1 = __importDefault(require("../config/default"));
const privateKey = default_1.default.privateKey;
const publicKey = default_1.default.publicKey;
const signJwt = (object, options) => {
    return jsonwebtoken_1.default.sign(object, privateKey, Object.assign(Object.assign({}, options), { algorithm: "RS256" }));
};
exports.signJwt = signJwt;
const verifyJWT = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded,
        };
    }
    catch (e) {
        return {
            valid: false,
            expired: e.message === "session expired",
            decoded: null,
        };
    }
};
exports.verifyJWT = verifyJWT;

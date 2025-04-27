"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.validatePassword = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const createUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.create(input);
        return user.toJSON();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.createUser = createUser;
const validatePassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        return null;
    }
    const isValid = yield user.comparePassword(password);
    if (!isValid)
        return false;
    return user.toJSON();
});
exports.validatePassword = validatePassword;
const findUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.default.findOne(query).lean();
});
exports.findUser = findUser;

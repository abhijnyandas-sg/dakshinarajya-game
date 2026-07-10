"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const room_store_1 = require("./room.store");
const shared_1 = require("@dakshina/shared");
let GameController = class GameController {
    constructor(rooms) {
        this.rooms = rooms;
    }
    reference() {
        return { ranis: shared_1.RANIS, palegallu: shared_1.PALEGALLU, spaces: shared_1.SPACES };
    }
    openRooms() {
        return { codes: this.rooms.openRoomCodes() };
    }
    room(code) {
        const state = this.rooms.get(code);
        if (!state)
            throw new common_1.NotFoundException("No such room");
        return state;
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Get)("reference"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameController.prototype, "reference", null);
__decorate([
    (0, common_1.Get)("rooms"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameController.prototype, "openRooms", null);
__decorate([
    (0, common_1.Get)("rooms/:code"),
    __param(0, (0, common_1.Param)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "room", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)("game"),
    __metadata("design:paramtypes", [room_store_1.RoomStore])
], GameController);
//# sourceMappingURL=game.controller.js.map
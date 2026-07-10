import { Module } from "@nestjs/common";
import { RoomStore } from "./room.store";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";

@Module({
  controllers: [GameController],
  providers: [RoomStore, GameGateway],
})
export class GameModule {}

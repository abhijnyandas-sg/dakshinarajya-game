import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { RoomStore } from "./room.store";
import { RANIS, PALEGALLU, SPACES } from "@dakshina/shared";

/**
 * REST surface (the Controller in MVC). Realtime play happens over the
 * gateway; these endpoints expose static reference data and room lookups.
 */
@Controller("game")
export class GameController {
  constructor(private readonly rooms: RoomStore) {}

  @Get("reference")
  reference() {
    return { ranis: RANIS, palegallu: PALEGALLU, spaces: SPACES };
  }

  @Get("rooms")
  openRooms() {
    return { codes: this.rooms.openRoomCodes() };
  }

  @Get("rooms/:code")
  room(@Param("code") code: string) {
    const state = this.rooms.get(code);
    if (!state) throw new NotFoundException("No such room");
    return state;
  }
}

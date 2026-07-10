import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  health() {
    return { ok: true, game: "dakshina-rajya", ts: Date.now() };
  }
}

import { Get, Controller, Render } from '@nestjs/common';

@Controller('/panel')
export class HomeController {
  @Get()
  @Render('index')
  index() {}
}

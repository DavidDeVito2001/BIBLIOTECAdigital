import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CopiesService } from '../../copies/services/copies.service';
import { CreateCopyDTO } from '../../copies/dto/create-copies.dto';

@Controller('copies')
export class CopiesController {
    constructor(private copiesService: CopiesService){}

    @Post(':bookId')
    createCopy(
        @Param('bookId', ParseIntPipe)bookId:number,
        @Body() copy: CreateCopyDTO    
    ){
        return this.copiesService.createCopy(bookId, copy)
    }

}

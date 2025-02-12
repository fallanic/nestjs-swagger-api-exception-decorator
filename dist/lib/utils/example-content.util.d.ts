import { HttpException } from '@nestjs/common';
import { ContentObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { MergedOptions } from '../interfaces/options.interface';
export declare const resolveTemplatePlaceholders: (options: MergedOptions, exception: HttpException) => any;
export declare const buildContentObjects: (
  exceptions: HttpException[],
  options: MergedOptions,
) => Record<number, ContentObject>;
export declare const mergeExampleContent: (content: ContentObject, newContent: ContentObject) => void;


import { CLINICAL_TAG_CATEGORIES } from '@/components/referral-tagging/constants/tagCategories';

export type TagCategory = 'status' | 'priority' | 'clinical' | 'administrative' | 'custom';

export interface TagCategoryInfo {
  category: TagCategory;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const getTagCategory = (tag: string): TagCategory => {
  for (const [categoryName, tags] of Object.entries(CLINICAL_TAG_CATEGORIES)) {
    if (tags.includes(tag)) {
      return categoryName as TagCategory;
    }
  }
  return 'custom';
};

export const getTagCategoryInfo = (category: TagCategory): TagCategoryInfo => {
  switch (category) {
    case 'status':
      return {
        category: 'status',
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-200'
      };
    case 'priority':
      return {
        category: 'priority',
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200'
      };
    case 'clinical':
      return {
        category: 'clinical',
        color: 'text-green-800',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200'
      };
    case 'administrative':
      return {
        category: 'administrative',
        color: 'text-purple-800',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200'
      };
    case 'custom':
    default:
      return {
        category: 'custom',
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200'
      };
  }
};

export const getTagStyle = (tag: string): string => {
  const category = getTagCategory(tag);
  const categoryInfo = getTagCategoryInfo(category);
  return `${categoryInfo.color} ${categoryInfo.bgColor} ${categoryInfo.borderColor}`;
};

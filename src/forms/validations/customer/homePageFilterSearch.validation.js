import * as Yup from "yup";

export const homePageFilterSearch = Yup.object().shape({
    min: Yup.number().typeError('Min price must be a number'),
    max: Yup.number().typeError('Max price must be a number'),
}) 
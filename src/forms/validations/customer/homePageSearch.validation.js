import * as Yup from "yup";

export const homePageSearch = Yup.object().shape({
    location: Yup.string()
        .required("To view prices and availability, please enter a location."),
    type: Yup.string()
        .required("To view prices and availability, please select from suggested location.")
})
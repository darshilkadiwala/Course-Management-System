import axios from "axios";
import React, { useState } from "react";

export function FooterWrapper(props) {
	const [categories, setCategories] = useState({});
	const loadCategories = async () => {
		try {
			const url = "http://localhost:5000/api/v1/category?populate=true";
			const { data: res } = await axios.get(url);
			setCategories(res);
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};
	loadCategories();
	return <div>HELLO</div>;
}

import React from "react";
import "./Search.css";

const Search = ({ title, data, renderItem, keyExtractor }) => {
	return (
		<div className="search-container">
			<h2 className="title">{title}</h2>
			<ul className="search-list">
				{data.map((item, index) => (
					<li key={keyExtractor ? keyExtractor(item, index) : index}>
						{renderItem(item)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Search;

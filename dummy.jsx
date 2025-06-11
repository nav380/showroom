const dummy = [];

for (let i = 1; i <= 10000; i++) {
  const index = (i - 1) % 5; // To cycle through the options
  const productTypes = ["Shirt", "T-shirt", "Jeans", "Jacket", "Sweater"];
  const categories = ["Casual", "Sportswear", "Denim", "Outerwear", "Casual"];
  const seasons = ["Summer", "Winter", "Fall", "Spring", "Summer"];
  const fabrics = ["Cotton", "Polyester", "Denim", "Wool", "Cashmere"];
  const valueDrivers = ["Comfort", "Durability", "Style", "Warmth", "Luxury"];
  const designerHeads = ["Designer A", "Designer B", "Designer C", "Designer D", "Designer E"];
  const enteredBy = ["User 1", "User 2", "User 3", "User 4", "User 5"];
  const statuses = ["Active", "Inactive"];
  const dmmStatuses = ["Approved", "Pending"];
  const remarks = ["Lightweight fabric", "Breathable material", "Slim fit", "Heavy-duty", "Soft and cozy"];
  const comments = ["Best seller", "New arrival", "Top-rated", "Limited edition", "Highly rated"];
  const mainImage ="../../../public/images/main.jpeg";

  dummy.push({
    product_code: `P${i.toString().padStart(4, "0")}`,
    style_no: `S${i.toString().padStart(4, "0")}`,
    product_type: productTypes[index],
    designer_head: designerHeads[index],
    entered_by: enteredBy[index],
    category: categories[index],
    season: seasons[index],
    fabric: fabrics[index],
    value_driver: valueDrivers[index],
    sustainable: i % 2 === 0,
    designer_status: statuses[index % statuses.length],
    dmm_status: dmmStatuses[i % 2],
    remarks: remarks[index],
    comment: comments[index],
    is_active: true,
    main_image: "../../../public/images/main.jpeg",
    inspiration_image: `inspiration${i}.jpg`,
    front_image: `front${i}.jpg`,
    details_image: `details${i}.jpg`,
    back_image: `back${i}.jpg`,
    sleeve_image: `sleeve${i}.jpg`,
    fabric_image: `fabric${i}.jpg`,
    created_at: new Date().toISOString(),
  });
}

export default dummy;

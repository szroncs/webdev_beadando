Project planner is a tool on the site so users can build their own requirements from a list, and get an estimated price.

In the navbar it it is called "Planner". Comes after "Partners".

In index.html after Logo Cloud Section create a new section for the palnner. Section name: Planner, below that a disclaimer text: "Disclaimer: This is an estimated price. The final price may vary depending on the complexity of the project."

The planner is an interactive table of website components and prices. It has 3 columns: Component (drop down list), Price (read only), and Note text field of 255 characters wher the user can add title, section name or any other notes. Default row is Main page (100 EUR). There is a button to add a new row. There is a button to remove a row. The remove button is only visible if there is more than one row. The configuration of the table is stored in a JSON object.

At the bottom of the table there is a Total price field, which is the sum of all the prices of the selected components. And a complexity score from 1 to 10.

Complexity is calculated based on the number of components / 2 rounded up to the nex coplexity level caped at 10. Component list be served from a backend JSON file (like the existing services). The planner don't validate the user input. If the user wants to add the same component multiple time they can. 

Components are:
- Main page (100 EUR)
- Additional page (25 EUR)
- Contact page with form (50 EUR)
- Chart (25 EUR)
- Authentication: user / password (50 EUR)
- Authentication: SSO: Google / GitHub / Microsoft (100 EUR)
- Authentication: SSO: Google / GitHub / Microsoft + 2FA (150 EUR)
- Blog (25 EUR)
- E-commerce: basic (500 EUR)
- E-commerce: advanced (1000 EUR)
- Social media integration (50 EUR)
- Youtube integration (50 EUR)
- SEO: basic (25 EUR)
- SEO: advanced (100 EUR)
- Analytics: Google Analytics (25 EUR)
- Analytics: Custom analytics (100 EUR)
- Onine training for site owners (25 EUR)
- On-site training for site owners (100 EUR)
- Age verification (25 EUR)
- Separate downtime page (25 EUR)
- Multi-language support (60 EUR)
- GDPR compliance (25 EUR)
- Accessibility compliance (25 EUR)
- Advanced security (100 EUR)
- Chatbot (50 EUR)
- AI Chatbot (100 EUR)
- AI Assistant (150 EUR)
- AI Content Generator (200 EUR)
- AI Image Generator (250 EUR)
- AI Video Generator (300 EUR)
- 8:00-17:00 support (25 EUR)
- 24/7 support (100 EUR)


Users can submit the planner as a project request. This will open a contact form with the plan config ID, total price and complexity score pre-filled. 
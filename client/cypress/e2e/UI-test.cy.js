describe("Product display in the shop test", () => {
	before(() => {
		cy.visit("/shop");
	});

	it("should display a list of products", () => {
		cy.get(".product-list").should("exist");

		cy.get(".product-container")
			.should("exist")
			.and("have.length.greaterThan", 0);
	});
});

describe("Product detail page test", () => {
	before(() => {
		cy.visit("/shop");
	});

	it("should navigate to the product detail page", () => {
		cy.get(".product-container").first().click();

		cy.url().should("include", "/product/");
	});

	after(() => {
		cy.go("back");
	});
});

describe("Filtering test", () => {
	before(() => {
		cy.visit("/shop");
	});

	it("Should display products high to low price", () => {
		cy.contains("Newest First").click();

		cy.contains("Price High to Low").click();

		cy.get(".product-list").should("exist");

		cy.wait(2000);
		cy.get(".product-container .price").then((priceElements) => {
			const prices = [...priceElements].map((el) =>
				parseFloat(el.innerText.replace("$", ""))
			);

			const sortedPrices = [...prices].sort((a, b) => b - a);
			expect(prices).to.deep.equal(sortedPrices);
		});
	});
});

describe("Login Page Tests", () => {
	beforeEach(() => {
		cy.visit("/login");
	});

	it("Should render login form elements", () => {
		cy.contains("Sign In").should("exist");

		cy.get(".login-form").within(() => {
			return (
				cy.get('input[name="email"]').should("exist") &&
				cy.get('input[name="password"]').should("exist")
			);
		});

		cy.get('button[type="submit"]').contains("Sign In").should("exist");

		cy.contains("Forgot Your Password?").should("exist");
	});

	it("Should show validation errors for empty inputs", () => {
		cy.get('button[type="submit"]').contains("Sign In").click();

		cy.get(".login-form").within(() => {
			return (
				cy.contains("Email is required").should("exist") &&
				cy.contains("Password is required").should("exist")
			);
		});
	});

	it("Should log in successfully with valid credentials", () => {
		cy.get(".login-form").within(() => {
			cy.get('input[name="email"]').type("test@gmail.com");
			cy.get('input[name="password"]').type("123456");

			cy.get('button[type="submit"]').contains("Sign In").click();
		});

		cy.url().should("include", "/dashboard");
		cy.contains("Account Details").should("exist");
		cy.contains("test@gmail.com").should("exist");
	});
});

describe("Test place order functionality", () => {
	before(() => {
		cy.visit("/login");

		cy.get(".login-form").within(() => {
			cy.get('input[name="email"]').type("test@gmail.com");
			cy.get('input[name="password"]').type("123456");

			cy.get('button[type="submit"]').contains("Sign In").click();
		});

		cy.url().should("include", "/dashboard");
		cy.contains("Account Details").should("exist");
		cy.contains("test@gmail.com").should("exist");
	});

	it("Should add a product to the wishlist", () => {
		cy.visit("/shop");

		// Click the first product
		cy.get(".product-container").first().click();

		// Verify we are on the product details page
		cy.url().should("include", "/product/");

		// Capture the product name for validation
		cy.get(".item-name")
			.invoke("text")
			.then((productName) => {
				// Add the product to the cart
				cy.get(".product-container .bag-btn").click();

				// Verify the cart opens
				cy.get(".mini-cart-open").should("exist");

				// Verify the product appears in the cart
				cy.get(".item-box").should("exist").and("contain.text", productName);
			});

		// Click the "Place Order" button
		cy.contains("Place Order").click();

		cy.contains("Thank you for your order.").should("exist");
	});
});

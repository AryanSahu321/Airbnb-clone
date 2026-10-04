# Managing Google Maps API Costs & Security

## Step 1: Calculate Your Safe Daily Limit

Google provides $200 in free monthly credits. A standard dynamic web map costs **$7 per 1,000 loads**, which breaks down to a maximum of **28,500 free map loads** every month.

To distribute this evenly across the month and prevent the credit from running out early, use a strict daily allocation:

- **Safe Daily Cap:** 900 requests per day
- **Monthly Calculation:** 900 loads × 31 days = 27,900 monthly loads (safely underneath the 28,500 limit).

---

## Step 2: Configure the Cut-off Limit in Google Cloud

Follow these steps in your Google Cloud dashboard to enforce a hard stop:

1. Open the main navigation menu in the **Google Cloud Console** and go to **Google Maps Platform > Quotas**.
2. Click the **APIs** dropdown menu at the top of the page and select the specific map service you are using (e.g., _Maps JavaScript API_ for a standard web map).
3. Scroll down to find the **Map loads** line item.
4. Click the **Edit / Three-dots icon** on the right side of the row.
5. Uncheck the **"Unlimited"** box.
6. Type `900` into the **New Value / Requests per day** box and hit **Submit**.

> **Note:** Once active, the platform allows users visiting your app to load the map freely. The exact moment the 900th map load occurs in a single day, Google immediately freezes requests, displays a graceful error screen on the frontend map container, and protects your financial profile from being charged. The counter resets at midnight Pacific Time.

---

## Step 3: Block Theft (Crucial First Step)

Setting a daily cap limits your bill, but if an unauthorized user extracts your exposed frontend API key, they could burn through your 900-request daily allocation within minutes—leaving your actual users with a broken app for the rest of the day.

1. Go to **APIs & Services > Credentials**.
2. Click on your **API Key** to open its settings.
3. Set up an **Application Restriction**:
   - Select **HTTP Referrers (Websites)**.
   - Add your exact web URL (e.g., `https://yourwebsite.com*`).

This ensures that the map works strictly on your site, preventing anyone else from stealing your credit allocations.

Best practices for managing API keys
Restrict your API key
Delete unneeded API keys to minimize exposure to attacks
Delete and recreate your API keys periodically
Don't include API keys in client code or commit them to code repositories
Implement strong monitoring and logging

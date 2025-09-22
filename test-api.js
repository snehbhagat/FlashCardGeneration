#!/usr/bin/env node

// Simple test script for the flashcard generation API
// Run with: node test-api.js

async function testFlashcardGeneration() {
  console.log("🧪 Testing Flashcard Generation API...\n");

  // Test data
  const testInput = {
    topic: "Photosynthesis",
    count: 3,
    difficulty: "medium"
  };

  try {
    console.log("📤 Sending request to /api/flashcards/generate");
    console.log("Input:", JSON.stringify(testInput, null, 2));

    const response = await fetch("http://localhost:8080/api/flashcards/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testInput),
    });

    console.log(`\n📥 Response Status: ${response.status} ${response.statusText}`);

    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Success!");
      console.log("Generated cards:", JSON.stringify(result.data?.cards, null, 2));
      
      if (result.rateLimitInfo) {
        console.log("\n📊 Rate Limit Info:");
        console.log(`Remaining: ${result.rateLimitInfo.remaining}`);
        console.log(`Reset Time: ${new Date(result.rateLimitInfo.resetTime).toLocaleString()}`);
      }
    } else {
      console.log("❌ Error:");
      console.log(JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error("🚨 Network Error:", error.message);
    console.log("\n💡 Make sure:");
    console.log("1. The development server is running (npm run dev)");
    console.log("2. GROQ_API_KEY is set in .env file");
    console.log("3. You have a valid Groq API key");
  }
}

async function testHealthCheck() {
  console.log("\n🏥 Testing Health Check...");
  
  try {
    const response = await fetch("http://localhost:8080/api/flashcards/health");
    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Health: ${result.status}`);
    
    if (result.status === "healthy") {
      console.log("✅ Service is healthy!");
    } else {
      console.log("⚠️ Service is unhealthy");
    }
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
  }
}

// Run tests
async function runTests() {
  await testHealthCheck();
  await testFlashcardGeneration();
  
  console.log("\n🎯 Test completed!");
  console.log("\n📝 Next steps:");
  console.log("1. Add your Groq API key to .env: GROQ_API_KEY=gsk_...");
  console.log("2. Test the frontend by creating flashcards in the UI");
  console.log("3. Monitor the console for any errors");
}

runTests().catch(console.error);
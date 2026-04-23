# Versa Stress Test Generator
filename = "versa_1m_test.txt"
content = "This is a test of the Versa translation engine. " # 48 chars
iterations = 1000000 // len(content)

with open(filename, "w") as f:
    for _ in range(iterations):
        f.write(content)
    # Fill the remaining gap to hit exactly 1,000,000
    f.write("A" * (1000000 - (iterations * len(content))))

print(f"File '{filename}' generated. Size: {1000000} characters.")
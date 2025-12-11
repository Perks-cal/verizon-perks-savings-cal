FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies to cache them
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the app without tests
RUN ./mvnw clean package -DskipTests

EXPOSE 8081

CMD ["java", "-jar", "target/*.jar"]

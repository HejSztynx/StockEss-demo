FROM gradle:8-jdk21 AS builder
WORKDIR /home/gradle/project

COPY --chown=gradle:gradle . .

RUN ./gradlew clean build -x test

FROM openjdk:21-jdk-slim
WORKDIR /app

COPY --from=builder /home/gradle/project/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

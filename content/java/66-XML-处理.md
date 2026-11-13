# 第 18 章 JSON 与序列化

# 66. XML 处理

## 学习目标

- 掌握 JAXB
- 学会 StAX
- 理解 XML 解析

## 66.1 JAXB

```java
@XmlRootElement
public class Person {
    @XmlElement
    private String name;
}

JAXBContext ctx = JAXBContext.newInstance(Person.class);
Marshaller m = ctx.createMarshaller();
m.marshal(person, System.out);
```

## 66.2 StAX

```java
XMLInputFactory f = XMLInputFactory.newInstance();
XMLStreamReader r = f.createXMLStreamReader(new StringReader(xml));
while (r.hasNext()) {
    r.next();
    if (r.isStartElement()) {
        System.out.println(r.getLocalName());
    }
}
```

## 66.3 DOM / SAX

- DOM：全内存
- SAX：流式

## 66.4 陷阱

- 大文件内存
- 编码
- 命名空间

## 66.5 最佳实践

- StAX 流式
- JAXB 简洁
- 显式编码

## 小结

- JAXB 映射
- StAX 流式
- 显式编码
- 大文件

package com.css.sword.platform.comm.codecache.browsercache;

import java.security.NoSuchAlgorithmException;
import java.security.Security;

import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

import com.css.sword.kernel.utils.SwordSecurityUtils;

/**
 * DES加密的，文件中共有两个方法,加密、解密
 * 
 */
public class DES {
	private String Algorithm = "DES";
	private SecretKey deskey;
	private Cipher cipher;
	private byte[] encryptorData;
	private byte[] decryptorData;

	/**
	 * 初始化 DES 实例
	 */
	public DES() {
		init();
	}

	/**
	 * 初始化 DES 加密算法的一些参数
	 */
	public void init() {
		Security.addProvider(new com.sun.crypto.provider.SunJCE());
		try {
			// keygen = KeyGenerator.getInstance(Algorithm);
			// deskey = keygen.generateKey();
			// 生成密钥
			String key = "12345678";
			byte[] keyByte = key.getBytes();
			DESKeySpec keySpec = new DESKeySpec(keyByte);
			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(Algorithm);
			deskey = keyFactory.generateSecret(keySpec);

			cipher = Cipher.getInstance(Algorithm);

		} catch (NoSuchAlgorithmException ex) {
			ex.printStackTrace();
		} catch (NoSuchPaddingException ex) {
			ex.printStackTrace();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * 对 byte[] 进行加密
	 * 
	 * @param datasource
	 *            要加密的数据
	 * @return 返回加密后的 byte 数组
	 */
	public byte[] createEncryptor(byte[] datasource) {
		try {
			cipher.init(Cipher.ENCRYPT_MODE, deskey);
			encryptorData = cipher.doFinal(datasource);
		} catch (java.security.InvalidKeyException ex) {
			ex.printStackTrace();
		} catch (javax.crypto.BadPaddingException ex) {
			ex.printStackTrace();
		} catch (javax.crypto.IllegalBlockSizeException ex) {
			ex.printStackTrace();
		}
		return encryptorData;
	}

	/**
	 * 将字符串加密
	 * 
	 * @param datasource
	 * @return
	 * @throws Exception
	 */
	public byte[] createEncryptor(String datasource) throws Exception {
		return createEncryptor(datasource.getBytes());
	}

	/**
	 * 对 datasource 数组进行解密
	 * 
	 * @param datasource
	 *            要解密的数据
	 * @return 返回解密后的 byte[]
	 */
	public byte[] createDecryptor(byte[] datasource) {
		try {
			cipher.init(Cipher.DECRYPT_MODE, deskey);
			decryptorData = cipher.doFinal(datasource);
		} catch (java.security.InvalidKeyException ex) {
			ex.printStackTrace();
		} catch (javax.crypto.BadPaddingException ex) {
			ex.printStackTrace();
		} catch (javax.crypto.IllegalBlockSizeException ex) {
			ex.printStackTrace();
		}
		return decryptorData;
	}

	/**
	 * 
	 * 将 DES 加密过的 byte数组转换为字符串
	 * 
	 * @param dataByte
	 * @return
	 */
	public String byteToString(byte[] dataByte) {
		String returnStr = null;
		returnStr = new String(SwordSecurityUtils.encodeBase64(dataByte));
		return returnStr;
	}

	/**
	 * 
	 * 将字符串转换为DES算法可以解密的byte数组
	 * 
	 * @param dataByte
	 * @return
	 * @throws Exception
	 */
	public byte[] stringToByte(String datasource) throws Exception {
		byte[] sorData = SwordSecurityUtils.decodeBase64(datasource.getBytes());
		return sorData;
	}

	/**
	 * 输出 byte数组
	 * 
	 * @param data
	 */
	public void printByte(byte[] data) {
		System.out.println("*********开始输出字节流**********");
		System.out.println("字节流: " + data.toString());
		for (int i = 0; i < data.length; i++) {
			System.out.println("第 " + i + "字节为：" + data[i]);
		}
		System.out.println("*********结束输出字节流**********");
	}

	public static void main(String args[]) throws Exception {
		// 加密源数据
		String encryptorString = "，。《》》、沃尔夫额外中软测试DES数据";

		DES des = new DES();
		// System.out.println("加密前的byte长度"+encryptorString.getBytes().length);
		// //加密获得的byte数组
		// byte[] encryptorByte = des.createEncryptor(encryptorString);
		// System.out.println("加密获得byte长度："+encryptorByte.length);
		// //加密后的byte[] 转换来的字符串
		// String byteToString = des.byteToString(encryptorByte);
		//
		// System.out.println("加密前的数据："+encryptorString);
		// System.out.println("加密后的byte[]");
		// des.printByte(encryptorByte);
		// System.out.println("加密后的数据："+byteToString);
		//
		// /*
		// * 可以对字符串进行一系列的处理
		// */
		//
		// //解密后的字符串
		// String decryptorString = null;
		//
		// //将byteToString转换为原来的byte[]
		// byte[] stringToByte = des.stringToByte(byteToString);
		// //将stringToByte解密后的byte[]
		// byte[]decryptorByte = des.createDecryptor(stringToByte);
		// //解密后的byte[]转换为原来的字符串
		// decryptorString = new String(decryptorByte);
		//
		// System.out.println("解密前的数据："+byteToString);
		//
		// // System.out.println("转换来的解密的byte[]");
		// des.printByte(stringToByte);
		// //System.out.println("解密后的数据："+decryptorString);

		byte[] test1 = encryptorString.getBytes();
		System.out.println("加密前获得byte长度：" + test1.length);
		byte[] encryptorByte = des.createEncryptor(test1);
		System.out.println("加密获得byte长度：" + encryptorByte.length);
		byte[] decryptorByte = des.createDecryptor(encryptorByte);
		System.out.println("解密密获得byte长度：" + decryptorByte.length);
		System.out.println("解密获得String：" + new String(decryptorByte));
	}

}
